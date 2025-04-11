'use client';

import { DataType, EPermission, EPermissionAction } from '@zpanel/core';
import { createMedia } from '@zpanel/ui/utils';
import { mixins } from 'gexii/theme';
import { useAction } from 'gexii/hooks';
import { useGeneralErrorHandler, useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { withLoadingEffect } from '@zpanel/ui/hoc';
import { Table, Cell } from 'gexii/table';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';

import { api, query } from 'src/service';
import { withPermissionRule } from 'src/guards';
import { Avatar, SimpleBar } from 'src/components';

const LoadableTextField = withLoadingEffect(TextField, 'onChange', 'disabled');

// ----------

interface UserViewProps {
  users: DataType.UserDto[];
}

export default function UserView({ users }: UserViewProps) {
  const [roleOptions] = query.useRoleOptions();
  const snackbar = useSnackbar();
  const refresh = useRefresh();

  // --- FUNCTIONS ---

  const completeWithToast = async (message: string) => {
    await refresh();
    snackbar.success(message);
  };

  // --- HANDLERS ---

  const handleError = useGeneralErrorHandler();

  // --- PROCEDURES ---

  const updateRole = useAction(
    async (user: DataType.UserDto, role: string) => {
      await api.updateUserRole(user.id, { role });
      await completeWithToast('User role updated successfully');
    },
    { onError: handleError },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    cells: {
      name: (
        <Cell
          label="Name"
          path="name"
          width={300}
          render={(name, user: DataType.UserDto) => (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={user.avatar ? createMedia.url(user.avatar) : undefined} />
              <Stack direction="column" spacing={0.5}>
                <Typography sx={mixins.ellipse()} color="textPrimary">
                  {name}
                </Typography>
                <Typography sx={mixins.ellipse()} color="textDisabled">
                  {user.email}
                </Typography>
              </Stack>
            </Stack>
          )}
        />
      ),
      role: (
        <Cell
          label="Permission Role"
          path="role.code"
          render={(role: string, user: DataType.UserDto) => (
            <RuledTextField
              select
              value={role}
              fullWidth
              onChange={(event) => updateRole.call(user, event.target.value)}
            >
              {roleOptions.length === 0 && <MenuItem value={role}>Loading...</MenuItem>}
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RuledTextField>
          )}
        />
      ),
    },
  };

  return (
    <>
      <SimpleBar sx={{ width: '100%' }}>
        <Table source={users} sx={{ minWidth: 600 }}>
          {sections.cells.name}
          {sections.cells.role}
        </Table>
      </SimpleBar>
    </>
  );
}

// ----- RULED COMPONENTS -----

const RuledTextField = withPermissionRule(LoadableTextField, EPermission.USER_CONFIGURE, {
  action: EPermissionAction.UPDATE,
  behavior: 'disabled',
});
