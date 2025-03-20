'use client';

import { DataType, EAppKeyStatus, EPermission, EPermissionAction } from '@zpanel/core';
import { isNaN, omit } from 'lodash';
import { useCopyToClipboard } from 'react-use';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { Box, Button as PureButton, Chip, Stack, styled, Tooltip } from '@mui/material';

import { api } from 'src/service';
import { withDefaultProps, withLoadingEffect } from 'src/hoc';
import { withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { Cell, PageHeadButtonStack, SimpleBar, Table } from 'src/components';
import AppKeyEditForm from 'src/forms/AppKeyEditForm';

const Button = withLoadingEffect(PureButton);

// ----------

interface AppKeyViewProps {
  appKeys: DataType.AppKeyDto[];
  showLess?: boolean;
}

export default function AppKeyView({ appKeys, showLess = false }: AppKeyViewProps) {
  const dialogs = useDialogs();
  const router = useRouter();
  const [, copyToClipboard] = useCopyToClipboard();

  // --- FUNCTIONS ---

  const refetch = () => router.refresh();

  const isExpired = (appKey: DataType.AppKeyDto) => appKey.status === EAppKeyStatus.EXPIRED;

  // --- PROCEDURES ---

  const grantAppKey = useAction(async (appKey?: DataType.AppKeyDto) => {
    const appKeyDetail = appKey ? omit(await api.getAppKeyDetail(appKey.id), 'status') : undefined;
    await dialogs.form(AppKeyEditForm, 'Grant A New App Key', {
      defaultValues: appKeyDetail,
      maxWidth: 'sm',
    });

    if (appKey) await api.revokeAppKey(appKey.id);
    await refetch();
  });

  const editAppKey = useAction(async (appKey: DataType.AppKeyDto) => {
    const appKeyDetail = await api.getAppKeyDetail(appKey.id);
    await dialogs.form(AppKeyEditForm, 'Edit App Key', {
      id: appKey.id,
      defaultValues: appKeyDetail,
      maxWidth: 'sm',
    });
    await refetch();
  });

  const revokeAppKey = useAction(async (appKey: DataType.AppKeyDto) => {
    const confirmation = await dialogs.confirm(
      'Warning',
      'Are you sure you want to revoke this app key? This action cannot be undone.',
      { color: 'error', okText: 'Delete' },
    );
    if (!confirmation) return;

    await api.revokeAppKey(appKey.id);
    await refetch();
  });

  // --- SECTION ELEMENTS ---

  const sections = {
    createNewRoleButton: (
      <AddButton
        startIcon={<Icons.Add fontSize="small" />}
        size="small"
        onClick={() => grantAppKey.call()}
      >
        Grant App Key
      </AddButton>
    ),
    cells: {
      name: <Cell align="center" path="name" label="Name" ellipsis />,
      owner: <Cell align="center" path="owner.name" label="Owner" ellipsis />,
      copyKey: (
        <Cell
          align="center"
          path="key"
          label="CopyKey"
          render={(key) => (
            <Tooltip title="Click to copy">
              <Button
                variant="text"
                color="inherit"
                size="small"
                onClick={(event) => {
                  event.currentTarget.blur();
                  copyToClipboard(key);
                }}
              >
                *****
              </Button>
            </Tooltip>
          )}
        />
      ),
      modifyDate: <Cell align="center" path="updatedAt" label="Modify Date" render={renderDate} />,
      expiresAt: (
        <Cell
          align="center"
          path="expiresAt"
          label="Expire Date"
          render={(date) => (date ? renderDate(date) : 'Never')}
        />
      ),
      lastModifier: <Cell align="center" path="lastModifier.name" label="Modifier" ellipsis />,
      lastAccessedAt: (
        <Cell
          align="center"
          path="lastAccessedAt"
          label="Last Accessed At"
          render={(date) => (date ? renderDate(date) : 'No Data')}
        />
      ),
      status: (
        <Cell
          align="center"
          path="status"
          label="Status"
          render={(status: DataType.AppKeyDto['status']) => (
            <Chip {...statusMap[status]} variant="outlined" size="small" />
          )}
        />
      ),
      actions: (
        <Cell
          align="center"
          render={(_, item: DataType.AppKeyDto) => (
            <Stack direction="row" spacing={1} justifyContent="end">
              {!isExpired(item) ? (
                <EditButton
                  onClick={() => editAppKey.call(item)}
                  startIcon={<Icons.Settings fontSize="small" />}
                >
                  Edit
                </EditButton>
              ) : (
                <EditButton
                  onClick={() => grantAppKey.call(item)}
                  startIcon={<Icons.Settings fontSize="small" />}
                >
                  Renew
                </EditButton>
              )}

              <DeleteButton
                color="error"
                onClick={() => revokeAppKey.call(item)}
                startIcon={<Icons.Remove fontSize="small" />}
              >
                Revoke
              </DeleteButton>
            </Stack>
          )}
        />
      ),
    },
  };

  return (
    <>
      <PageHeadButtonStack>{sections.createNewRoleButton}</PageHeadButtonStack>

      <SimpleBar>
        <Table source={appKeys} keyIndex="id" sx={{ minWidth: showLess ? 800 : 1200 }}>
          {sections.cells.status}
          {sections.cells.name}
          {sections.cells.copyKey}
          {!showLess && sections.cells.owner}
          {!showLess && sections.cells.lastModifier}
          {sections.cells.expiresAt}
          {sections.cells.lastAccessedAt}
          {sections.cells.modifyDate}
          {sections.cells.actions}
        </Table>
      </SimpleBar>
    </>
  );
}

// ----- HELPERS -----

function renderDate(value: unknown) {
  if (!value) return '';

  const date = new Date(value as never);
  if (isNaN(date)) return 'Invalid Date';

  return (
    <Tooltip title={new Date(date).toLocaleString()}>
      <Box component="span">{new Date(date).toLocaleDateString()}</Box>
    </Tooltip>
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

// ----- RULED COMPONENTS -----

const AddButton = withPermissionRule(Button, EPermission.APP_KEY_CONFIGURE, {
  action: EPermissionAction.CREATE,
  OR: [{ permission: EPermission.APP_KEY_MANAGEMENT }],
});

const EditButton = withPermissionRule(StyledRoleActionButton, EPermission.APP_KEY_CONFIGURE, {
  action: EPermissionAction.UPDATE,
  OR: [{ permission: EPermission.APP_KEY_MANAGEMENT }],
});

const DeleteButton = withPermissionRule(StyledRoleActionButton, EPermission.APP_KEY_CONFIGURE, {
  action: EPermissionAction.DELETE,
  OR: [{ permission: EPermission.APP_KEY_MANAGEMENT }],
});

// ----- CONSTANTS -----

const statusMap = {
  [EAppKeyStatus.ENABLED]: { label: 'Enabled', color: 'info' },
  [EAppKeyStatus.DISABLED]: { label: 'Disabled', color: 'default' },
  [EAppKeyStatus.EXPIRED]: { label: 'Expired', color: 'default' },
} as const;
