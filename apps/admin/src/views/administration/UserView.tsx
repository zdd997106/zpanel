'use client';

import { DataType, EPermission, EPermissionAction } from '@zpanel/core';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { Avatar, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { api } from 'src/service';
import { mixins } from 'src/theme';
import { useData } from 'src/hooks';
import { withPermissionRule } from 'src/guards';
import { Cell, SimpleBar, Table } from 'src/components';

// ----------

interface UserViewProps {
  users: DataType.UserDto[];
}

export default function UserView({ users }: UserViewProps) {
  const dialogs = useDialogs();
  const router = useRouter();

  const [roleOptions = []] = useData(() => api.getRoleOptions());

  // --- FUNCTIONS ---

  const refetch = () => router.refresh();

  // --- PROCEDURES ---

  const updateRole = useAction(
    async (id: string, role: string) => {
      await api.updateUserRole(id, { role });
      await refetch();
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
          render={(name, user: DataType.UserDto) => (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 250 }}>
              <Avatar src={user.avatar?.url} />
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
          path="role"
          render={(role: string, user: DataType.UserDto) => (
            <RuledTextField
              select
              value={role}
              fullWidth
              sx={{ minWidth: 200 }}
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
        <Table source={users}>
          {sections.cells.name}
          {sections.cells.role}
        </Table>
      </SimpleBar>
    </>
  );
}

// ----- RULED COMPONENTS -----

const RuledTextField = withPermissionRule(TextField, EPermission.USER_CONFIGURE, {
  action: EPermissionAction.UPDATE,
  behavior: 'disabled',
});
