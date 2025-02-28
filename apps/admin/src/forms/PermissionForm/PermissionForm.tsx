'use client';

import { forwardRef, useMemo, useRef } from 'react';
import { get, groupBy, noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldPath,
  FieldPathValue,
  PathValue,
  useForm,
  useFormContext,
  UseFormReturn,
  WatchObserver,
} from 'react-hook-form';
import { Field, Form } from 'gexii/fields';
import { IconButton, Stack, TextField } from '@mui/material';
import { v4 as uuid } from 'uuid';
import immer from 'immer';

import { BitwiseCheckbox, Cell, StatusButton, Table } from 'src/components';
import Icons from 'src/icons';
import { PermissionItem } from '@zpanel/core/dataType';
import { mixins } from 'src/theme';
import { useOpenList } from 'src/hooks/useOpenList';
import { FieldValues, initialPermission, schema } from './schema';
import { mockSource } from './mock';
import { actionConfig } from './configs';

type Item = FieldValues['permissions'][number];

// ----------

export interface PermissionFormProps {
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function PermissionForm(
  { onSubmit = noop, onSubmitError = noop }: PermissionFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues: useMemo(() => ({ permissions: mockSource }), []),
    resolver: zodResolver(schema),
  });

  const openList = useOpenList();
  const permissions = methods.watch('permissions');
  const a = useArrayField('permissions', { methods });

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    permissions.map((item, index) => map.set(item.id, index));
    return map;
  }, [permissions]);

  const itemsGroups = useMemo(
    () =>
      groupBy(
        permissions.map((permission) => ({ ...permission, parentId: permission.parentId || NONE })),
        'parentId',
      ),
    [permissions],
  );

  const source = useMemo(() => {
    const list: PermissionItem[] = [];

    itemsGroups[NONE].forEach((parent) => {
      list.push(parent);
      if (openList.isOpen(parent.id)) list.push(...(itemsGroups[parent.id] || []));
    });

    return list;
  }, [itemsGroups, openList]);

  // --- FUNCTIONS ---

  const removeItem = (id: string) => {
    methods.setValue(
      'permissions',
      permissions.filter((item) => item.id !== id),
    );
  };

  const addItem = (parentId: string | null) => {
    const id = uuid();
    methods.setValue('permissions', permissions.concat({ ...initialPermission, id, parentId }));

    if (parentId) openList.open(parentId);
  };

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(Promise.resolve(null))}
    >
      <Table
        size="small"
        keyIndex="id"
        source={source}
        getRowProps={(item: Item) => ({
          sx: { td: item.parentId ? { bgcolor: 'action.hover' } : {} },
        })}
      >
        <Cell
          label=""
          padding="checkbox"
          sx={{ padding: 0 }}
          render={(item: Item) => {
            if (item.parentId) return null; // Hide checkbox for child items
            return (
              <IconButton size="small" onClick={() => openList.toggle(item.id)}>
                <Icons.Forward
                  fontSize="inherit"
                  sx={{ rotate: openList.isOpen(item.id) ? '90deg' : '0deg' }}
                />
              </IconButton>
            );
          }}
        />

        <Cell
          label=""
          padding="none"
          width={50}
          sx={{ padding: 1 }}
          render={(_actionCode, item: Item) => (
            <Field name={`permissions.${indexMap.get(item.id)}.actionCode`}>
              <BitwiseCheckbox mask={actionConfig.value.all} />
            </Field>
          )}
        />

        <Cell
          label="Permission"
          path="name"
          sx={{ position: 'sticky', left: 0, zIndex: 2 }}
          bodyCellProps={{ sx: mixins.bgBlur({ blur: 16 }) }}
          render={(_name, item) => (
            <Field key={item.id} name={`permissions.${indexMap.get(item.id)}.name`}>
              <TextField
                fullWidth
                variant="standard"
                placeholder="New Permission"
                sx={{ minWidth: 'min(200px, 40vw)' }}
              />
            </Field>
          )}
        />

        <Cell
          label="Code"
          path="code"
          width={160}
          render={(_name, item) => (
            <Field key={item.id} name={`permissions.${indexMap.get(item.id)}.code`}>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Permission Code"
                sx={{ minWidth: 160 }}
              />
            </Field>
          )}
        />

        {actionConfig.options.map((option) => (
          <Cell
            key={option.label}
            label={option.label}
            path="actionCode"
            padding="checkbox"
            render={(_actionCode, item: Item) => (
              <Field name={`permissions.${indexMap.get(item.id)}.actionCode`}>
                <BitwiseCheckbox mask={option.action} />
              </Field>
            )}
          />
        ))}

        <Cell
          label=""
          padding="checkbox"
          render={(_, item: Item) => (
            <Stack direction="row" alignItems="center">
              <IconButton disabled={!!item.parentId} onClick={() => addItem(item.id)}>
                <Icons.Add fontSize="medium" />
              </IconButton>

              <IconButton onClick={() => removeItem(item.id)}>
                <Icons.Delete fontSize="medium" />
              </IconButton>

              <Field key={item.id} name={`permissions.${indexMap.get(item.id)}.status`}>
                <StatusButton />
              </Field>
            </Stack>
          )}
        />
      </Table>
    </Form>
  );
});

// ----- TYPES -----

const NONE = '';

interface UseArrayFieldOptions<TMethod, TKey> {
  methods?: TMethod;
  key?: TKey;
}

type MethodFieldValue<TMethod extends UseFormReturn<any, any, any>> =
  TMethod extends UseFormReturn<infer T, any, any> ? T : never;

function useArrayField<
  TMethod extends UseFormReturn<any, any, any>,
  TPath extends FieldPath<MethodFieldValue<TMethod>>,
  TKey extends string,
>(
  name: TPath,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  { methods = useFormContext() as never, key }: UseArrayFieldOptions<TMethod, TKey> = {},
) {
  type ItemType =
    FieldPathValue<MethodFieldValue<TMethod>, TPath> extends Array<infer U> ? U : never;
  type KeyType = ItemType[TKey extends keyof ItemType ? TKey : never];

  const value = methods.watch(name);
  const fields = useMemo<ItemType[]>(() => {
    const fields = (Array.isArray(value) ? value : []) as ItemType[];
    return immer.produce(fields, (draft) => {
      draft.forEach((item) => {
        const id = (key ? get(item, key) : get(item, '$id')) ?? uuid();
        Object.assign(item as never, { $id: () => id });
      });
    });
  }, [value, key]);

  const fieldRef = useRef(fields);
  fieldRef.current = fields;

  const findId = (target: unknown) =>
    key ? get(target, key, target) : get(target as any, '$id')?.();

  const match = (a: unknown, b: unknown) => findId(a) === findId(b);

  const append = (item: ItemType) => {
    const fields = fieldRef.current;
    methods.setValue(name, fields.concat(item) as never);
  };

  const remove = (target: ItemType | KeyType) => {
    const fields = fieldRef.current;
    methods.setValue(name, fields.filter((item) => !match(item, target)) as never);
  };

  const update = (target: ItemType | KeyType, value: ItemType) => {
    const fields = fieldRef.current;
    methods.setValue(name, fields.map((item) => (match(item, target) ? value : item)) as never);
  };

  const swap = (a: ItemType | KeyType, b: ItemType | KeyType) => {
    const fields = fieldRef.current;
    const aIndex = fields.findIndex((item) => match(item, a));
    const bIndex = fields.findIndex((item) => match(item, b));
    methods.setValue(
      name,
      fields.map((item, index) => {
        if (index === aIndex) return fields[bIndex];
        if (index === bIndex) return fields[aIndex];
        return item;
      }) as never,
    );
  };

  const insert = (target: ItemType | KeyType, item: ItemType, before = false) => {
    const fields = fieldRef.current;
    const index = fields.findIndex((item) => match(item, target));
    methods.setValue(
      name,
      (before
        ? fields.slice(0, index).concat(item, ...fields.slice(index))
        : fields.slice(0, index + 1).concat(item, ...fields.slice(index + 1))) as never,
    );
  };

  return { fields, append, remove, update, swap, insert };
}
