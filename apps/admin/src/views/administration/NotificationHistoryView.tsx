'use client';

import { isNaN } from 'lodash';
import { DataType, EPermission, EPermissionAction, FindAllNotificationsDto } from '@zpanel/core';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { useGeneralErrorHandler, useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { withLoadingEffect } from '@zpanel/ui/hoc';
import { Table, Cell } from 'gexii/table';
import { QueryField } from 'gexii/query-fields';
import {
  Box,
  Button as MuiButton,
  Pagination,
  PaginationProps,
  Stack,
  Tooltip,
} from '@mui/material';

import configs from 'src/configs';
import { api } from 'src/service';
import { withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { PageHeadButtonStack, SimpleBar } from 'src/components';
import NotificationDetail from 'src/features/NotificationDetail';
import BroadcastNotificationForm from 'src/forms/BroadcastNotificationForm';

const Button = withLoadingEffect(MuiButton);

const BroadcastButton = withPermissionRule(Button, EPermission.NOTIFICATION_CONFIGURE, {
  action: EPermissionAction.CREATE,
});

const { notificationType: typeLabelMap, notificationAudience: audienceLabelMap } = configs.labelMap;

// ----------

interface NotificationHistoryViewProps {
  notifications: DataType.NotificationDto[];
  paginationProps?: PaginationProps;
}

export default function NotificationHistoryView({
  notifications,
  paginationProps,
}: NotificationHistoryViewProps) {
  const dialogs = useDialogs();
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

  const openDetail = useAction(async (id: string) => {
    const detail = await api.getNotificationDetail(id);
    dialogs.view(NotificationDetail, 'Notification Detail', { data: detail, maxWidth: 'sm' });
  });

  const broadcastNotification = useAction(async () => {
    dialogs.form(BroadcastNotificationForm, 'Broadcast Notification', {
      maxWidth: 'sm',
      onOk: async () => completeWithToast('Notification broadcasted successfully'),
      onSubmitError: handleError,
    });
  });

  // --- SECTION ELEMENTS ---

  const sections = {
    broadcastButton: (
      <BroadcastButton
        startIcon={<Icons.Broadcast fontSize="small" />}
        size="small"
        onClick={() => broadcastNotification.call()}
      >
        Broadcast Notification
      </BroadcastButton>
    ),
    cells: {
      title: <Cell path="title" label="Title" />,
      sender: <Cell path="sender.name" label="Sender" />,
      type: <Cell path="type" label="Type" render={(type) => typeLabelMap.get(type)} />,
      audience: (
        <Cell
          path="audience"
          label="Audience"
          render={(audience) => audienceLabelMap.get(audience)}
        />
      ),
      createdAt: <Cell path="createdAt" label="Time" render={renderDate} />,
      action: (
        <Cell
          render={(_, item: DataType.NotificationDto) => (
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              onClick={() => openDetail.call(item.id)}
              startIcon={<Icons.Document fontSize="small" />}
              sx={{ typography: 'caption' }}
            >
              Detail
            </Button>
          )}
        />
      ),
    },
  };

  return (
    <QueryField.Provider schema={FindAllNotificationsDto.schema}>
      <PageHeadButtonStack>{sections.broadcastButton}</PageHeadButtonStack>

      <SimpleBar sx={{ marginBottom: 2 }}>
        <Table source={notifications} keyIndex="id" sx={{ minWidth: 800 }}>
          {sections.cells.createdAt}
          {sections.cells.title}
          {sections.cells.sender}
          {sections.cells.type}
          {sections.cells.audience}
          {sections.cells.action}
        </Table>
      </SimpleBar>

      <Stack direction="row" justifyContent="end">
        <QueryField query="page">
          <Pagination {...paginationProps} />
        </QueryField>
      </Stack>
    </QueryField.Provider>
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
