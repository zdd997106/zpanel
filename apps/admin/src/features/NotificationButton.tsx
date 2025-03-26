'use client';

import { noop } from 'lodash';
import { ENotificationStatus } from '@zpanel/core';
import { combineCallbacks } from 'gexii/utils';
import { useImperativeHandle, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAction } from 'gexii/hooks';
import {
  Badge,
  Button,
  Card,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';

import configs from 'src/configs';
import { api, query } from 'src/service';
import { inPx } from 'src/utils';
import { useAuth } from 'src/guards';
import { withDefaultProps } from 'src/hoc';
import Icons from 'src/icons';
import { Popover, SimpleBar } from 'src/components';

import NotificationCard from './NotificationCard';

// ----------

interface NotificationButtonProps extends IconButtonProps {}

export default function NotificationButton({ children, ...props }: NotificationButtonProps) {
  const auth = useAuth();

  const [notificationCount, { refetch: updateNotificationCount }] = query.useUserNotificationCount(
    auth.id,
    { refetchInterval: 60 * 1000 }, // [NOTE] Polling every 1 minute
  );

  // --- FUNCTIONS ---

  const refreshLatestNotificationsRef = useRef(() => {});
  const refreshLatestNotifications = () => refreshLatestNotificationsRef.current();

  // --- HANDLERS ---

  const handleRead = () => {
    updateNotificationCount();
    refreshLatestNotifications();
  };

  // --- PROCEDURES ---

  const markAllAsRead = useAction(
    async () => api.updateUsersNotificationsAll(auth.id, { status: ENotificationStatus.READ }),
    { onSuccess: handleRead },
  );

  // --- ELEMENT SECTIONS ---

  const sections = {
    iconButton: (
      <IconButton {...props}>
        <Badge badgeContent={notificationCount || 0} color="error">
          {children}
        </Badge>
      </IconButton>
    ),
    title: (
      <NotificationTitle>
        <Typography variant="h6">Notifications</Typography>

        <Tooltip title="Mark all as read">
          <IconButton
            color="primary"
            loading={markAllAsRead.isLoading()}
            onClick={() => markAllAsRead.call()}
          >
            <Icons.DoneAll fontSize="small" />
          </IconButton>
        </Tooltip>
      </NotificationTitle>
    ),
    latestNotifications: (
      <SimpleBar sx={{ maxHeight: 270, minHeight: 100, typography: 'body2' }}>
        <LatestNotifications refreshRef={refreshLatestNotificationsRef} onRead={handleRead} />
      </SimpleBar>
    ),
  };

  return (
    <StyledPopover
      content={() => (
        <StyledPopoverContent>
          <Stack>
            {sections.title}
            {sections.latestNotifications}
          </Stack>
        </StyledPopoverContent>
      )}
    >
      {sections.iconButton}
    </StyledPopover>
  );
}

// ----- INTERNAL COMPONENTS -----

interface LatestNotificationsProps {
  refreshRef?: React.Ref<() => void>;
  onRead?: () => void;
}

function LatestNotifications({ refreshRef, onRead = noop }: LatestNotificationsProps) {
  const auth = useAuth();

  const { data: notifications = [], refetch } = useQuery({
    queryKey: [api.getLatestUserNotifications.getPath(auth.id)],
    queryFn: () => api.getLatestUserNotifications(auth.id),
  });

  // --- IMPERATIVE HANDLES ---

  useImperativeHandle(refreshRef, () => () => refetch());

  // --- ELEMENT SECTIONS ---

  const sections = {
    placeholder: (
      <Typography variant="body2" textAlign="center" paddingTop={4.5}>
        No records found
      </Typography>
    ),

    notifications: notifications.map((notification) => (
      <DialogContent
        key={notification.id}
        sx={{ bgcolor: notification.read ? 'transparent' : 'action.hover' }}
      >
        <NotificationCard
          data={notification}
          onRead={combineCallbacks(refetch, onRead)}
          onDeleted={combineCallbacks(refetch)}
        />
      </DialogContent>
    )),

    viewAllButton: (
      <Button variant="text" sx={{ typography: 'body2' }} href={configs.routes.notifications}>
        View all
      </Button>
    ),
  };

  if (notifications.length === 0) return sections.placeholder;
  return (
    <Stack>
      {sections.notifications}
      <Stack sx={{ padding: 1 }}>{sections.viewAllButton}</Stack>
    </Stack>
  );
}

// ----- STYLED -----

const StyledPopover = styled(
  withDefaultProps(Popover, {
    variant: 'click',
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
  }),
)(() => ({
  pointerEvents: 'auto',
}));

const StyledPopoverContent = styled(Card)(({ theme }) => ({
  width: `min(${inPx(380)}, calc(100vw - ${theme.spacing(4)}))`,
}));

const NotificationTitle = styled(
  withDefaultProps(DialogTitle<typeof Stack>, { component: Stack, direction: 'row' }),
)(({ theme }) => ({
  justifyContent: 'space-between',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: 'solid 1px',
  borderColor: theme.palette.divider,
}));
