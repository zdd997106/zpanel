'use client';

import { DataType, EPermission, EPermissionAction } from '@zpanel/core';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';

import { api, query } from 'src/service';
import { createMedia } from 'src/utils';
import { mixins } from 'src/theme';
import { useRefresh } from 'src/hooks';
import { withPermissionRule } from 'src/guards';
import { Avatar, Cell, SimpleBar, Table } from 'src/components';
import { withLoadingEffect } from 'src/hoc';

const LoadingTextField = withLoadingEffect(TextField, 'onChange', 'disabled');

// ----------

interface UserViewProps {
  users: DataType.UserDto[];
}

export default function UserView({ users }: UserViewProps) {
  const dialogs = useDialogs();
  const [roleOptions] = query.useRoleOptions();
  const refresh = useRefresh();

  // --- PROCEDURES ---

  const updateRole = useAction(
    async (id: string, role: string) => {
      await api.updateUserRole(id, { role });
      await refresh();
    },
    {
      onError: (error) => {
        dialogs.alert('Error', error.message, { color: 'error' });
      },
    },
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
              onChange={(event) => updateRole.call(user.id, event.target.value)}
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

const RuledTextField = withPermissionRule(LoadingTextField, EPermission.USER_CONFIGURE, {
  action: EPermissionAction.UPDATE,
  behavior: 'disabled',
});
