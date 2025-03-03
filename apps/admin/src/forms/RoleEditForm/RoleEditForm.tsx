/* eslint-disable no-bitwise */

'use client';

import { groupBy, includes, noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataType, EPermissionStatus, ERole, ERoleStatus, RolePermissionDto } from '@zpanel/core';
import { forwardRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { useDialogs } from 'gexii/dialogs';
import { Field, Form } from 'gexii/fields';
import {
  Collapse,
  FormControlLabel,
  Grid2 as Grid,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';

import { api, ServiceError } from 'src/service';
import { useOpenList } from 'src/hooks';
import Icons from 'src/icons';
import { BitwiseCheckbox, Cell, SimpleBar, StatusButton, Table } from 'src/components';

import { FieldValues, initialValues, schema } from './schema';
import { actionConfig } from './configs';

const RoleStatusButton = StatusButton.config(ERoleStatus.ENABLED, ERoleStatus.DISABLED);
type PermissionConfig = DataType.PermissionDto;

// ----------

export interface RoleEditFormProps {
  id?: string;
  defaultValues?: FieldValues;
  permissionConfigs: PermissionConfig[];
  onSubmit?: (submission: Promise<unknown>) => void;
}

export default forwardRef(function RoleEditForm(
  { id, defaultValues = initialValues, permissionConfigs = [], onSubmit = noop }: RoleEditFormProps,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const dialogs = useDialogs();

  const defaultRolePermissions = useDefaultRolePermissions(
    defaultValues.rolePermissions,
    permissionConfigs,
  );

  const methods = useForm<FieldValues>({
    defaultValues: { ...defaultValues, rolePermissions: defaultRolePermissions },
    resolver: zodResolver(schema),
  });

  const tableSource = useTableSource(permissionConfigs);

  // --- FUNCTIONS ---

  const isAdmin = () => defaultValues.code === ERole.ADMIN;

  const isSystemRole = () => includes([ERole.ADMIN, ERole.GUEST], defaultValues.code);

  const status = methods.watch('status');
  const isEnabled = () => status === ERoleStatus.ENABLED;

  const actionPath = useMemo(() => {
    const indexMap = Object.fromEntries(permissionConfigs.map((config, i) => [config.id, i]));
    return (config: PermissionConfig) => `rolePermissions.${indexMap[config.id]}.action`;
  }, [permissionConfigs]);

  const hasChildren = (predictParent: PermissionConfig) => {
    if (predictParent.parentId) return false;
    return permissionConfigs.some(
      (permission) => permission.parentId === predictParent.id && hasActions(permission),
    );
  };

  const getChangedRolePermissions = (values: FieldValues) => {
    if (!isEnabled()) return [];
    if (id) return findUpdatedPermissions(values.rolePermissions, defaultRolePermissions);
    return values.rolePermissions;
  };

  // --- PROCEDURES ---

  const procedure = useAction(
    async (values: FieldValues) => {
      if (id)
        await api.updateRole(id, { ...values, rolePermissions: getChangedRolePermissions(values) });
      else await api.createRole({ ...values, rolePermissions: getChangedRolePermissions(values) });
    },
    {
      onError: (error) => {
        if (error instanceof ServiceError) return error.emitFieldErrors(methods);
        dialogs.alert('Error', error.message);
      },
    },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    fields: {
      name: (
        <Field name="name">
          <TextField fullWidth label="Role Name" disabled={isSystemRole()} />
        </Field>
      ),
      code: (
        <Field name="code">
          <TextField fullWidth label="Role Code" disabled={isSystemRole()} />
        </Field>
      ),
      description: (
        <Field name="description">
          <TextField fullWidth label="Description" multiline rows={3} />
        </Field>
      ),
      status: (
        <Field
          name="status"
          shouldForwardError={false}
          helper={!isEnabled() && 'All permissions will be disabled for this role'}
        >
          <FormControlLabel
            control={<RoleStatusButton sx={{ marginLeft: 1 }} />}
            label={isEnabled() ? 'Active' : 'Disabled'}
          />
        </Field>
      ),
    },

    cells: {
      expandButton: (
        <Cell
          width={26}
          sx={{ padding: 0 }}
          render={(_, config: PermissionConfig) => {
            if (!hasChildren(config)) return null;
            return (
              <IconButton
                size="small"
                sx={{ fontSize: '1em', rotate: tableSource.isOpen(config.id) ? '90deg' : '0deg' }}
                onClick={() => tableSource.toggleOpen(config.id)}
              >
                <Icons.Forward fontSize="inherit" />
              </IconButton>
            );
          }}
        />
      ),
      name: (
        <Cell
          label="Permission"
          render={(_, config) => (
            <Field name={actionPath(config)} shouldForwardError={false}>
              <FormControlLabel
                label={<Typography variant="subtitle2">{config.name}</Typography>}
                control={<BitwiseCheckbox color="primary" mask={config.action} />}
              />
            </Field>
          )}
        />
      ),
      actionFields: actionConfig.options.map((option) => (
        <Cell
          key={option.action}
          padding="checkbox"
          align="center"
          label={option.label}
          render={(_, config: PermissionConfig) => {
            if ((config.action & option.action) === 0) return <Icons.Close color="disabled" />;
            return (
              <Field
                key={option.action}
                variant="pure"
                shouldForwardError={false}
                name={actionPath(config)}
              >
                <BitwiseCheckbox mask={option.action} />
              </Field>
            );
          }}
        />
      )),
    },
  };

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(procedure.call(values))}
    >
      <Grid container spacing={2} paddingTop={1}>
        <Grid size={{ xs: 12, md: 6 }}>{sections.fields.name}</Grid>
        <Grid size={{ xs: 12, md: 6 }}>{sections.fields.code}</Grid>
        <Grid size={{ xs: 12 }}>{sections.fields.description}</Grid>
        {!isSystemRole() && <Grid size={{ xs: 12, md: 6 }}>{sections.fields.status}</Grid>}

        {!isAdmin() && (
          <Grid size={{ xs: 12 }} paddingTop={1}>
            <Collapse in={isEnabled()} mountOnEnter>
              <SimpleBar sx={{ width: '100%', maxHeight: '80dvh' }}>
                <StyledTable
                  source={tableSource.getValue()}
                  size="small"
                  getRowProps={(item: PermissionConfig) => ({
                    sx: { td: item.parentId ? { bgcolor: 'action.hover' } : {} }, // Highlight the child rows
                  })}
                >
                  {sections.cells.expandButton}
                  {sections.cells.name}
                  {sections.cells.actionFields}
                </StyledTable>
              </SimpleBar>
            </Collapse>
          </Grid>
        )}
      </Grid>
    </Form>
  );
});

// ----- CONSTANTS -----

const NO_PARENT_ID = '';

// ----- INTERNAL HOOKS -----

const useTableSource = (permissionConfigs: PermissionConfig[]) => {
  const openList = useOpenList();

  const itemsGroups = useMemo(
    () =>
      groupBy(
        permissionConfigs.map((permission) => ({
          ...permission,
          parentId: permission.parentId || NO_PARENT_ID,
        })),
        'parentId',
      ),
    [permissionConfigs],
  );

  const source = useMemo(() => {
    const list: PermissionConfig[] = [];

    itemsGroups[NO_PARENT_ID]?.forEach((parent) => {
      list.push(parent);
      if (openList.isOpen(parent.id)) list.push(...(itemsGroups[parent.id] || []));
    });

    return list.filter(hasActions);
  }, [itemsGroups, openList]);

  return {
    getValue: () => source,
    open: openList.open,
    isOpen: openList.isOpen,
    toggleOpen: openList.toggle,
  };
};

function useDefaultRolePermissions(
  rolePermissions: RolePermissionDto[],
  permissionConfigs: PermissionConfig[],
): RolePermissionDto[] {
  return useMemo(() => {
    const actionMap = Object.fromEntries(
      rolePermissions.map((config) => [config.id, config.action]),
    );
    return permissionConfigs.map((config) => ({ ...config, action: actionMap[config.id] ?? 0 }));
  }, []);
}

// ----- HELPERS -----

function hasActions(item: PermissionConfig) {
  return item.action > 0 && item.status === EPermissionStatus.ENABLED;
}

function findUpdatedPermissions(value: RolePermissionDto[], originalValue: RolePermissionDto[]) {
  return value.filter(
    (rolePermission, index) => rolePermission.action !== originalValue[index].action,
  );
}

// ----- STYLED -----

const StyledTable = styled(Table)(({ theme }) => ({
  td: { padding: theme.spacing(0.5) }, // hide the border
}));
