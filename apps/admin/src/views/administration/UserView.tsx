'use client';

import { DataType } from '@zpanel/core';
import { useQuery } from '@tanstack/react-query';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import configs from 'src/configs';
import { api } from 'src/service';
import { mixins } from 'src/theme';
import { Cell, SimpleBar, Table } from 'src/components';

// ----------

export default function UserView() {
  const dialogs = useDialogs();

  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: [api.getAllUsers.getPath()],
    queryFn: () => api.getAllUsers(),
  });

  const { data: roleOptions = [] } = useQuery({
    queryKey: [api.getRoleOptions.getPath()],
    queryFn: () => api.getRoleOptions(),
  });

  // --- PROCEDURES ---

  const updateRole = useAction(
    async (id: string, role: string) => {
      await api.updateUserRole(id, { role });
      await refetchUsers();
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
            <TextField
              select
              value={role}
              fullWidth
              onChange={(event) => updateRole.call(user.id, event.target.value)}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      ),
    },
  };

  return (
    <>
      <Breadcrumbs>
        <Link href={configs.routes.dashboard}>Dashboard</Link>
        <Link href={configs.routes.userManagement}>User</Link>
      </Breadcrumbs>

      <Typography variant="h4">User Management</Typography>

      <Box paddingTop={3} />

      <SimpleBar sx={{ width: '100%' }}>
        <Table source={users}>
          {sections.cells.name}
          {sections.cells.role}
        </Table>
      </SimpleBar>
    </>
  );
}
