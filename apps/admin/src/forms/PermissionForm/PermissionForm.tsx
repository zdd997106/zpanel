'use client';

import { get, groupBy, isEmpty, isString, noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { EPermissionStatus } from '@zpanel/core/enum';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDialogs } from 'gexii/dialogs';
import { useAction, useSleep } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { CSSObject, IconButton, Stack, styled, TextField } from '@mui/material';

import { api, ServiceError } from 'src/service';
import { CustomError } from 'src/classes';
import { useOpenList } from 'src/hooks';
import Icons from 'src/icons';
import { BitwiseCheckbox, Cell, StatusButton, Table } from 'src/components';

import { FieldValues, PermissionItem, schema } from './schema';
import { actionConfig, tableConfig } from './configs';
import { groupItems, NO_PARENT_ID, procedureConfirmation, usePermissionField } from './helpers';

const PermissionStatusButton = StatusButton.config(
  EPermissionStatus.ENABLED,
  EPermissionStatus.DISABLED,
);

// ----------

export interface PermissionFormProps {
  defaultValues: FieldValues;
  addItemRef?: React.Ref<() => void>;
  resetRef?: React.Ref<() => void>;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function PermissionForm(
  {
    defaultValues,
    addItemRef,
    resetRef,
    onSubmit = noop,
    onSubmitError = noop,
  }: PermissionFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const dialogs = useDialogs();
  const sleep = useSleep();

  const methods = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const permissionsField = usePermissionField(methods, { openRow: (id) => tableSource.open(id) });
  const tableSource = useTableSource(permissionsField.fields);

  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;

  // --- FUNCTIONS ---

  const revalidatePermissionsField = (childPath: string) => {
    const errorFieldNames = methods.formState.errors.permissions
      ?.map?.((permission) => get(permission, [childPath, 'ref', 'name']))
      .filter(Boolean);
    methods.trigger(errorFieldNames);
  };

  const reset = async () => {
    await sleep(); // [NOTE] Delay 1 frame, wait for the form default values to be updated
    methods.reset(defaultValuesRef.current);
  };

  // --- PROCEDURES ---

  const procedure = useAction(
    async (values: FieldValues) => {
      const confirmed = await procedureConfirmation(dialogs);

      if (!confirmed) throw CustomError.createUserCancelledError();

      const { newItems, changedItems, deletedItems } = groupItems(
        values.permissions,
        defaultValues.permissions,
      );

      await api.updatePermissions({
        newPermissions: newItems,
        changedPermissions: changedItems,
        deletedIds: deletedItems.map((item) => item.id),
      });
    },
    {
      onError: (error) => {
        // Skip error handling if user cancelled the operation
        if (CustomError.isUserCancelledError(error)) return;

        if (error instanceof ServiceError && error.hasFieldErrors())
          return error.emitFieldErrors(methods);

        onSubmitError(error);
      },
    },
  );

  // --- EFFECTS ---

  // To ensure the error fields are visible to users when the form is submitted
  useEffect(() => {
    const errorIds = methods.formState.errors.permissions
      ?.map?.((error, index) => {
        if (!error || isEmpty(error)) return null;
        const { parentId } = permissionsField.fields[index];
        if (!parentId || parentId === NO_PARENT_ID) return null;
        return parentId;
      })
      .filter(isString);

    if (errorIds && errorIds.length > 0) tableSource.open(...errorIds);
  }, [methods.formState.submitCount]);

  // --- IMPERATIVE HANDLES ---

  useImperativeHandle(addItemRef, () => () => permissionsField.add());

  useImperativeHandle(resetRef, () => reset);

  // --- SECTION ELEMENTS ---

  const sections = {
    cells: {
      expandButton: (
        <Cell
          padding="none"
          width={40}
          sx={{ padding: 0, paddingLeft: 1 }}
          render={(item: PermissionItem) => {
            if (!permissionsField.hasChildren(item)) return null;
            return (
              <IconButton size="small" onClick={() => tableSource.toggleOpen(item.id)}>
                <Icons.Forward
                  fontSize="inherit"
                  sx={{ rotate: tableSource.isOpen(item.id) ? '90deg' : '0deg' }}
                />
              </IconButton>
            );
          }}
        />
      ),

      checkboxForAll: (
        <Cell
          padding="none"
          width={50}
          sx={{ padding: 1 }}
          path="action"
          render={(_action, item: PermissionItem) => (
            <Field name={permissionsField.relativePath(item, 'action')}>
              <BitwiseCheckbox mask={actionConfig.value.all} />
            </Field>
          )}
        />
      ),

      nameField: (
        <Cell
          label="Permission"
          sx={[{ position: 'sticky', zIndex: 2 }, positionAdjustment]}
          bodyCellProps={{ sx: { bgcolor: 'background.paper' } }}
          render={(item) => (
            <Field key={item.id} name={permissionsField.relativePath(item, 'name')}>
              <TextField
                fullWidth
                variant="standard"
                placeholder="New Permission"
                sx={{ minWidth: tableConfig.namefieldWidth }}
              />
            </Field>
          )}
        />
      ),

      codeField: (
        <Cell
          label="Code"
          width={250}
          render={(item) => (
            <Field key={item.id} name={permissionsField.relativePath(item, 'code')}>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Permission Code"
                onBlur={() => revalidatePermissionsField('code')}
                sx={{ minWidth: 160 }}
              />
            </Field>
          )}
        />
      ),

      checkboxFields: actionConfig.options.map((option) => (
        <Cell
          key={option.label}
          label={option.label}
          path="action"
          padding="checkbox"
          render={(_action, item: PermissionItem) => (
            <Field name={permissionsField.relativePath(item, 'action')}>
              <BitwiseCheckbox mask={option.action} />
            </Field>
          )}
        />
      )),

      moves: (
        <Cell
          padding="checkbox"
          render={(_, item: PermissionItem) => (
            <Stack direction="row" alignItems="center">
              <IconButton disabled={!!item.parentId} onClick={() => permissionsField.add(item)}>
                <Icons.Add fontSize="medium" />
              </IconButton>

              <IconButton onClick={() => permissionsField.remove(item)}>
                <Icons.Delete fontSize="medium" />
              </IconButton>

              <Field key={item.id} name={permissionsField.relativePath(item, 'status')}>
                <PermissionStatusButton />
              </Field>
            </Stack>
          )}
        />
      ),
    },
  };

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(procedure.call(values))}
    >
      <StyledTable
        size="small"
        keyIndex="id"
        source={tableSource.getValue()}
        getRowProps={(item: PermissionItem) => ({
          sx: { td: item.parentId ? { bgcolor: 'background.neutral' } : {} }, // Highlight the child rows
        })}
      >
        {sections.cells.expandButton}
        {sections.cells.checkboxForAll}
        {sections.cells.nameField}
        {sections.cells.codeField}
        {sections.cells.checkboxFields}
        {sections.cells.moves}
      </StyledTable>
    </Form>
  );
});

// ----- INTERNAL HOOKS -----

const useTableSource = (permissions: PermissionItem[]) => {
  const openList = useOpenList();

  const itemsGroups = useMemo(
    () =>
      groupBy(
        permissions.map((permission) => ({
          ...permission,
          parentId: permission.parentId || NO_PARENT_ID,
        })),
        'parentId',
      ),
    [permissions],
  );

  const source = useMemo(() => {
    const list: PermissionItem[] = [];

    itemsGroups[NO_PARENT_ID]?.forEach((parent) => {
      list.push(parent);
      if (openList.isOpen(parent.id)) list.push(...(itemsGroups[parent.id] || []));
    });

    return list;
  }, [itemsGroups, openList]);

  return {
    getValue: () => source,
    open: openList.open,
    isOpen: openList.isOpen,
    toggleOpen: openList.toggle,
  };
};

// ----- STYLED -----

const StyledTable = styled(Table)(() => ({
  td: { border: 'none' }, // hide the border
}));

const positionAdjustment: CSSObject = {
  left: -1, // [NOTE] A 1px gap on the left side, this is to align the sticky cell with the table cell
};
