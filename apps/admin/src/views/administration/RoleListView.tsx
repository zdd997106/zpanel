'use client';

import { includes, noop } from 'lodash';
import { DataType, EPermission, EPermissionAction, ERole, ERoleStatus } from '@zpanel/core';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import {
  Avatar,
  Box,
  Button as MuiButton,
  Card,
  Chip,
  Grid2 as Grid,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';

import { api } from 'src/service';
import { useRefresh } from 'src/hooks';
import { withDefaultProps, withLoadingEffect } from 'src/hoc';
import { withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { PageHeadButtonStack } from 'src/components';
import RoleEditForm from 'src/forms/RoleEditForm';

const Button = withLoadingEffect(MuiButton);

// ----------

interface RoleListViewProps {
  roles: DataType.RoleDto[];
  permissions: DataType.PermissionDto[];
}

export default function RoleListView({ roles, permissions }: RoleListViewProps) {
  const dialogs = useDialogs();
  const refresh = useRefresh();

  // --- PROCEDURES ---

  const createNewRole = useAction(async () => {
    dialogs.form(RoleEditForm, 'New Role', {
      permissionConfigs: permissions,
      maxWidth: 'sm',
      onOk: async () => refresh(),
    });
  });

  const editRole = useAction(async (role: DataType.RoleDto) => {
    const roleDetail = await api.getRoleDetail(role.id);
    dialogs.form(RoleEditForm, 'Edit Role', {
      id: role.id,
      defaultValues: roleDetail,
      permissionConfigs: permissions,
      maxWidth: 'sm',
      onOk: async () => refresh(),
    });
  });

  const deleteRole = useAction(async (role: DataType.RoleDto) => {
    dialogs.confirm(
      'Warning',
      'Are you sure you want to delete this role? This action cannot be undone, all associated users will be reset to the default role (guest).',
      {
        color: 'error',
        okText: 'Delete',
        onOk: async () => {
          await api.deleteRole(role.id);
          await refresh();
        },
      },
    );
  });

  // --- SECTION ELEMENTS ---

  const sections = {
    createNewRoleButton: (
      <AddButton
        startIcon={<Icons.Add fontSize="small" />}
        size="small"
        onClick={() => createNewRole.call()}
      >
        New Role
      </AddButton>
    ),

    roleCards: roles.map((role) => (
      <RoleCard
        key={role.id}
        role={role}
        onEdit={() => editRole.call(role)}
        onDelete={() => deleteRole.call(role)}
      />
    )),
  };

  return (
    <>
      <PageHeadButtonStack>{sections.createNewRoleButton}</PageHeadButtonStack>

      <Grid container spacing={2}>
        {sections.roleCards.map((card, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
            {card}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

// ----- INTERNAL COMPONENTS -----

interface RoleCardProps {
  role: DataType.RoleDto;
  onEdit?: () => void;
  onDelete?: () => void;
}

function RoleCard({ role, onEdit = noop, onDelete = noop }: RoleCardProps) {
  const canDelete = !includes([ERole.ADMIN, ERole.GUEST], role.code);
  const active = role.status === ERoleStatus.ENABLED;

  // --- FUNCTIONS ---

  const getRoleIcon = (roleCode: string) => {
    switch (roleCode) {
      case ERole.ADMIN:
        return <Icons.Fort />;
      case ERole.GUEST:
        return <Icons.Flower />;
      default:
        return <Icons.Groups />;
    }
  };

  // --- PROCEDURES ---

  const editRole = useAction(onEdit);

  const deleteRole = useAction(onDelete);

  // --- SECTION ELEMENTS ---

  const sections = {
    title: (
      <Stack direction="column" sx={{ paddingY: 1, opacity: active ? 1 : 0.8 }}>
        <Typography variant="h6">{role.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {role.description}
        </Typography>
      </Stack>
    ),

    labels: (
      <Stack direction="row" spacing={1} marginTop="auto" paddingTop={1}>
        <Chip
          color="default"
          size="small"
          label={`Users: ${role.userCount}`}
          sx={{ typography: 'caption' }}
        />

        <Tooltip title={new Date(role.updatedAt).toLocaleString('en-US')} arrow>
          <Chip
            size="small"
            label={`Last Modified At: ${new Date(role.updatedAt).toLocaleDateString('en-US')}`}
            sx={{ typography: 'caption' }}
          />
        </Tooltip>
      </Stack>
    ),

    button: {
      editButton: (
        <EditButton
          startIcon={<Icons.Settings />}
          sx={{ color: 'text.primary' }}
          onClick={() => editRole.call()}
        >
          Edit
        </EditButton>
      ),
      deleteButton: (
        <DeleteButton
          disabled={!canDelete}
          startIcon={<Icons.Remove />}
          color="error"
          onClick={() => deleteRole.call()}
        >
          Delete
        </DeleteButton>
      ),
    },
  };

  return (
    <StyledRoleCard>
      <Stack direction="column" height="100%">
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Avatar sx={{ bgcolor: active ? 'action.active' : 'action.disabled' }}>
            {getRoleIcon(role.code)}
          </Avatar>

          <Stack direction="row" spacing={1}>
            {sections.button.editButton}
            {canDelete && sections.button.deleteButton}
            {!canDelete && (
              <Tooltip title="System roles cannot be deleted.">
                <Box>{sections.button.deleteButton}</Box>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {sections.title}
        {sections.labels}
      </Stack>
    </StyledRoleCard>
  );
}

// ----- STYLED -----

const StyledRoleCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  height: '100%',
  border: 'solid 1px',
  borderColor: theme.palette.divider,
}));

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

// ----- RULED COMPONENTS -----

const AddButton = withPermissionRule(Button, EPermission.ROLE_CONFIGURE, {
  action: EPermissionAction.CREATE,
});

const EditButton = withPermissionRule(StyledRoleActionButton, EPermission.ROLE_CONFIGURE, {
  action: EPermissionAction.UPDATE,
});

const DeleteButton = withPermissionRule(StyledRoleActionButton, EPermission.ROLE_CONFIGURE, {
  action: EPermissionAction.DELETE,
});
