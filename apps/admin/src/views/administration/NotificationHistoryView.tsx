'use client';

import { isNaN } from 'lodash';
import { DataType, EPermission, EPermissionAction, FindAllNotificationsDto } from '@zpanel/core';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
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
import { withLoadingEffect } from 'src/hoc';
import Icons from 'src/icons';
import { Cell, PageHeadButtonStack, QueryField, SimpleBar, Table } from 'src/components';
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
  const router = useRouter();

  // --- FUNCTIONS ---

  const refetch = () => router.refresh();

  const openDetail = useAction(async (id: string) => {
    const detail = await api.getNotificationDetail(id);
    dialogs.view(NotificationDetail, 'Notification Detail', { data: detail, maxWidth: 'sm' });
  });

  const broadcastNotification = async () => {
    dialogs.form(BroadcastNotificationForm, 'Broadcast Notification', {
      maxWidth: 'sm',
      onOk: refetch,
    });
  };

  // --- SECTION ELEMENTS ---

  const sections = {
    broadcastButton: (
      <BroadcastButton
        startIcon={<Icons.Broadcast fontSize="small" />}
        size="small"
        onClick={broadcastNotification}
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
              onClick={() => openDetail.call(item.id)}
              startIcon={<Icons.Visible fontSize="small" />}
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
