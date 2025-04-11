'use client';

import {
  DataType,
  ENotificationStatus,
  ENotificationType,
  FindUserNotificationsDto,
} from '@zpanel/core';
import { useRefresh } from '@zpanel/ui/hooks';
import { QueryField } from 'gexii/query-fields';
import {
  Card,
  Divider,
  MenuItem,
  Pagination,
  PaginationProps,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { NotificationCard } from 'src/features';
import configs from 'src/configs';

// ----------

interface NotificationViewProps {
  notifications: DataType.UserNotificationDto[];
  paginationProps: PaginationProps;
}

export default function NotificationView({
  notifications,
  paginationProps,
}: NotificationViewProps) {
  const refresh = useRefresh();

  // --- SECTION ELEMENTS ---

  const sections = {
    statusTabs: (
      <QueryField query="status" defaultValue="">
        <Tabs sx={{ paddingX: 2, paddingTop: 2 }}>
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </QueryField>
    ),

    typeField: (
      <Stack direction="row" paddingX={2} paddingTop={1}>
        <QueryField query="type" defaultValue="">
          <TextField select fullWidth label="Type">
            {types.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </QueryField>
      </Stack>
    ),

    notificationPlaceholder: (
      <Stack height={100} justifyContent="center" alignItems="center">
        <Typography variant="body2">No matching notifications found</Typography>
      </Stack>
    ),

    notifications: notifications.map((notification) => (
      <Stack
        direction="row"
        key={notification.id}
        padding={2}
        bgcolor={notification.read ? 'transparent' : 'action.hover'}
      >
        <NotificationCard
          key={notification.id}
          data={notification}
          onDeleted={refresh}
          onRead={refresh}
        />
      </Stack>
    )),

    rowsPerPage: (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" paddingBottom={0.6}>
          Rows:
        </Typography>

        <QueryField query="limit">
          <TextField
            select
            size="small"
            variant="standard"
            slotProps={{ select: { disableUnderline: true } }}
          >
            {perPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </QueryField>
      </Stack>
    ),

    pagination: (
      <QueryField query="page">
        <Pagination {...paginationProps} />
      </QueryField>
    ),
  };

  return (
    <QueryField.Provider schema={FindUserNotificationsDto.schema}>
      <Card sx={{ border: 'solid 1px', borderColor: 'divider' }}>
        <Stack spacing={2}>
          {sections.statusTabs}
          {sections.typeField}

          <Divider sx={{ border: 'none' }} />

          <Stack>
            {notifications.length > 0 ? (
              <>{sections.notifications}</>
            ) : (
              <>{sections.notificationPlaceholder}</>
            )}
          </Stack>

          <Stack direction="row" justifyContent="end" alignItems="center" paddingY={2} spacing={2}>
            {sections.rowsPerPage}
            {sections.pagination}
          </Stack>
        </Stack>
      </Card>
    </QueryField.Provider>
  );
}

// ----- SETTINGS -----

const tabs = [
  { label: 'All', value: '' },
  { label: 'Unread', value: ENotificationStatus.RECEIVED },
  { label: 'Read', value: ENotificationStatus.READ },
];

const typeLabelMap = configs.labelMap.notificationType;
const types = [
  { label: 'All', value: '' },
  ...[
    ENotificationType.SYSTEM,
    ENotificationType.SECURITY_ALERT,
    ENotificationType.GENERAL,
    ENotificationType.TASK,
    ENotificationType.ANNOUNCEMENT,
  ].map((type) => ({ label: typeLabelMap.get(type), value: type })),
];

const perPageOptions = [5, 10, 15, 20];
