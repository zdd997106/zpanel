import { useDialogs } from 'gexii/dialogs';
import { isEqual, noop, omit } from 'lodash';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { FieldValues, initialPermissionItem, PermissionItem } from './schema';

// ----- UTILITIES -----

export function groupItems<T extends { id: string; parentId: string | null }>(
  items: T[],
  originalItems: T[],
) {
  const getNewItems = () => {
    return items.filter((permission) => !originalItems.find((p) => p.id === permission.id));
  };

  const getChangedItems = (newItems: T[]) => {
    const newItemIds = newItems.map((item) => item.id);
    return items.filter(
      (permission) =>
        !newItemIds.includes(permission.id) &&
        !isEqual(
          permission,
          originalItems.find((p) => p.id === permission.id),
        ),
    );
  };

  const getDeletedItems = () => {
    return originalItems
      .filter((item) => !items.find((current) => current.id === item.id)) // Find deleted items
      .reduce<T[]>((accumulator, deleteItem) => {
        return accumulator.concat(
          deleteItem,
          ...originalItems.filter((item) => item.parentId === deleteItem.id), // Find children of deleted items
        );
      }, []);
  };

  const newItems = getNewItems();
  return {
    newItems,
    changedItems: getChangedItems(newItems),
    deletedItems: getDeletedItems(),
  };
}

// ----- HOOKS -----

interface usePermissionFieldOptions {
  openRow?: (id: string) => void;
}

/**
 * Hook to manage the permissions field array
 */
export const usePermissionField = (
  methods: UseFormReturn<FieldValues>,
  { openRow = noop }: usePermissionFieldOptions,
) => {
  type Item = PermissionItem;

  const dialogs = useDialogs();

  const permissionsField = useFieldArray({
    name: 'permissions',
    control: methods.control,
    keyName: '$id', // [NOTE] Use the key $id to avoid rewriting the id value
  });

  // [NOTE] The `fields` only update when the actions of `permissionsField` calls, so DO NOT rely on the editable values in `fields` directly
  //        Use `getItemValue` to ensure retrieve the up-to-date item values if you need to access the item's editable values
  const { fields } = permissionsField;

  const findIndex = useMemo(() => {
    const indexMap = new Map(fields.map((field, index) => [field.id, index]));
    return (id: string) => indexMap.get(id) ?? -1;
  }, [fields]);

  const addItem = (parent: Item | null = null) => {
    permissionsField.append({
      ...initialPermissionItem,
      id: uuid(),
      parentId: parent ? parent.id : null,
    });
    if (parent) openRow(parent.id);
  };

  const removeItem = async ({ id }: Item) => {
    const item = getItemValue(id);
    const isParent = hasChildren(item);
    const needsConfirmation = !isInitialItem(item) || isParent;

    const canRemove = !needsConfirmation || (await removeConfirmation(dialogs, { isParent }));
    if (canRemove) permissionsField.remove(findIndex(item.id));
  };

  const relativePath = (item: Item, childName: string) => {
    const index = fields.findIndex((field) => field.id === item.id);
    return ['permissions', index, childName].join('.');
  };

  const hasChildren = (parentItem: Item) => {
    // [NOTE] table source will modify the parentId to NO_PARENT_ID if the item is a root item, so we need to check both
    const isRootItem = !parentItem.parentId || parentItem.parentId === NO_PARENT_ID;
    return isRootItem && fields.some((field) => field.parentId === parentItem.id);
  };

  const getItemValue = (id: string) => methods.getValues(`permissions.${findIndex(id)}`);

  return {
    fields,
    add: addItem,
    remove: removeItem,
    relativePath,
    hasChildren,
  };
};

function isInitialItem(item: PermissionItem) {
  return isEqual(
    omit(item, 'id', 'parentId', '$id'),
    omit(initialPermissionItem, 'id', 'parentId'),
  );
}

// ----- DIALOGS -----

type UseDialogsReturn = ReturnType<typeof useDialogs>;

export const removeConfirmation = (dialogs: UseDialogsReturn, { isParent = false }) => {
  return dialogs.confirm(
    'Warning',
    [
      'You are deleting a permission. Are you sure you want to proceed?',
      isParent ? 'The children permissions will also be deleted.' : '',
    ].join('\n'),
    { color: 'error' },
  );
};

export const procedureConfirmation = (dialogs: UseDialogsReturn) => {
  return dialogs.confirm(
    'Notice',
    'This action will synchronize the permissions with the server. Are you sure you want to proceed?',
    { maxWidth: 'xs' },
  );
};

// ----- CONSTANTS -----

export const NO_PARENT_ID = '' as const;
