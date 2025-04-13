'use client';

import { DataType, EPermission, EPermissionAction, EUserStatus, FindUsersDto } from '@zpanel/core';
import { createMedia } from '@zpanel/ui/utils';
import { mixins } from 'gexii/theme';
import { useState } from 'react';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { useGeneralErrorHandler, useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { withDefaultProps, withLoadingEffect } from '@zpanel/ui/hoc';
import { Table, Cell } from 'gexii/table';
import { QueryField } from 'gexii/query-fields';
import {
  Button as MuiButton,
  Chip,
  Pagination,
  PaginationProps,
  Stack,
  styled,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';

import { api, query } from 'src/service';
import { withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { Avatar, PageHeadButtonStack, SearchField, SimpleBar } from 'src/components';
import UserEditForm from 'src/forms/UserEditForm';

const Button = withLoadingEffect(MuiButton);

// ----------

interface UserViewProps {
  users: DataType.UserDto[];
  paginationProps?: PaginationProps;
}

export default function UserView({ users, paginationProps }: UserViewProps) {
  const snackbar = useSnackbar();
  const dialogs = useDialogs();
  const refresh = useRefresh();
  const [searchBy, setFilterBy] = useState('name');
  const [roleOptions] = query.useRoleOptions();

  // --- FUNCTIONS ---

  const completeWithToast = async (message: string) => {
    await refresh();
    snackbar.success(message);
  };

  // --- HANDLERS ---

  const handleError = useGeneralErrorHandler();

  // --- PROCEDURES ---

  const updateUser = useAction(
    async (user: DataType.UserDto) => {
      const userDetail = await api.getUserDetail(user.id);
      dialogs.form(UserEditForm, 'Edit User', {
        id: user.id,
        defaultValues: { ...userDetail, role: userDetail.role.code },
        maxWidth: 'sm',
        onOk: async () => completeWithToast('User updated successfully'),
        onSubmitError: handleError,
      });
    },
    { onError: handleError },
  );

  const createUser = useAction(async () => {
    dialogs.form(UserEditForm, 'Create User', {
      maxWidth: 'sm',
      onOk: async () => completeWithToast('User created successfully'),
      onSubmitError: handleError,
    });
  });

  const confirmToDeleteUser = useAction(async (user: DataType.UserDto) => {
    dialogs.confirm(
      'Warning',
      [
        `Are you sure you want to delete this user?`,
        user.email && `The user will be notified via email after deletion.`,
      ]
        .filter(Boolean)
        .join(' '),
      { onOk: () => deleteUser.call(user) },
    );
  });

  const deleteUser = useAction(
    async (user: DataType.UserDto) => {
      await api.deleteUser(user.id);
      completeWithToast('User deleted successfully');
    },
    { onError: handleError },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    cells: {
      user: (
        <Cell
          label="User"
          render={(_, user: DataType.UserDto) => (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={user.avatar ? createMedia.url(user.avatar) : undefined} />
              <Stack direction="column" spacing={0.5}>
                <Typography color="textPrimary" sx={mixins.ellipse()}>
                  {user.name}
                </Typography>
                <Typography color="textDisabled" variant="body2" sx={mixins.ellipse()}>
                  {user.account} {user.email && `(${user.email})`}
                </Typography>
              </Stack>
            </Stack>
          )}
        />
      ),
      role: (
        <Cell
          label="Role"
          path="role"
          padding="checkbox"
          align="center"
          width={135}
          render={(role: DataType.UserDto['role']) => (
            <Chip label={role.name} variant="filled" size="small" sx={{ width: '100%' }} />
          )}
        />
      ),
      action: (
        <Cell
          width={10}
          render={(_, user: DataType.UserDto) => (
            <Stack direction="row" spacing={1}>
              <EditButton startIcon={<Icons.Settings />} onClick={() => updateUser.call(user)}>
                Edit
              </EditButton>
              <DeleteButton
                startIcon={<Icons.Delete />}
                color="error"
                onClick={() => confirmToDeleteUser.call(user)}
              >
                Delete
              </DeleteButton>
            </Stack>
          )}
        />
      ),
    },

    createUser: (
      <CreateButton
        variant="contained"
        color="primary"
        size="small"
        startIcon={<Icons.Add fontSize="small" />}
        onClick={() => createUser.call()}
      >
        New User
      </CreateButton>
    ),

    status: (
      <QueryField query="status" childFields={['page', 'limit']}>
        <Tabs>
          <StyledTab value={EUserStatus.ACTIVE} label="Active" icon={<Icons.Check />} />
          <StyledTab value={EUserStatus.INACTIVE} label="Inactive" icon={<Icons.Pause />} />
          <StyledTab value={EUserStatus.BLOCKED} label="Blocked" icon={<Icons.Remove />} />
        </Tabs>
      </QueryField>
    ),

    search: (
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          select
          value={searchBy}
          label="Search By"
          sx={{ width: 150 }}
          onChange={(event) => setFilterBy(event.target.value)}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="account">Account</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="role">Role</MenuItem>
        </TextField>

        <QueryField
          query={searchBy}
          defaultValue=""
          shouldForwardLoading={{ prop: 'disabled' }}
          childFields={['page', 'limit', 'name', 'email', 'account', 'role'].filter(
            (field) => field !== searchBy,
          )}
        >
          {searchBy !== 'role' ? (
            <SearchField fullWidth />
          ) : (
            <TextField fullWidth select>
              <MenuItem value="">All</MenuItem>
              {roleOptions.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </QueryField>
      </Stack>
    ),

    pagination: (
      <QueryField query="page" shouldForwardLoading={{ prop: 'disabled' }}>
        <Pagination {...paginationProps} />
      </QueryField>
    ),

    placeholder: (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        typography="body2"
        height="30vh"
      >
        No matched users
      </Stack>
    ),
  };

  return (
    <QueryField.Provider schema={FindUsersDto.schema}>
      <PageHeadButtonStack>{sections.createUser}</PageHeadButtonStack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        marginBottom={3}
        spacing={2}
      >
        <Box flexGrow={1}>{sections.search}</Box>
        {sections.status}
      </Stack>

      <SimpleBar sx={{ width: '100%' }}>
        <Table source={users} sx={{ minWidth: 600 }}>
          {sections.cells.user}
          {sections.cells.role}
          {sections.cells.action}
        </Table>
      </SimpleBar>

      {paginationProps?.count === 0 ? (
        sections.placeholder
      ) : (
        <Stack direction="row" justifyContent="end" marginTop={3}>
          {sections.pagination}
        </Stack>
      )}
    </QueryField.Provider>
  );
}

// ----- STYLED -----

const StyledRoleActionButton = styled(
  withDefaultProps(Button, {
    size: 'small',
    variant: 'outlined',
    color: 'inherit',
  }),
)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
}));

const StyledTab = styled(
  withDefaultProps(Tab, {
    iconPosition: 'start',
  }),
)(() => ({}));

// ----- RULED COMPONENTS -----

const CreateButton = withPermissionRule(Button, EPermission.USER_CONFIGURE, {
  action: EPermissionAction.CREATE,
});

const EditButton = withPermissionRule(StyledRoleActionButton, EPermission.USER_CONFIGURE, {
  action: EPermissionAction.UPDATE,
});

const DeleteButton = withPermissionRule(StyledRoleActionButton, EPermission.USER_CONFIGURE, {
  action: EPermissionAction.DELETE,
});
