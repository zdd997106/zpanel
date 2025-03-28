import { noop } from 'lodash';
import {
  DataType,
  ENotificationStatus,
  ENotificationType,
  EPermission,
  EPermissionAction,
} from '@zpanel/core';
import { useAction } from 'gexii/hooks';
import { Fragment } from 'react';
import { Box, IconButton as MuiIconButton, Link, Stack, Tooltip, Typography } from '@mui/material';

import { api } from 'src/service';
import { mixins } from 'src/theme';
import { useAuth, withPermissionRule } from 'src/guards';
import { withLoadingEffect } from 'src/hoc';
import Icons from 'src/icons';
import { Avatar } from 'src/components';

const IconButton = withLoadingEffect(MuiIconButton);

// ----------

interface NotificationCardProps {
  data: DataType.UserNotificationDto;
  preview?: boolean;
  onRead?: () => void;
  onDeleted?: () => void;
}

export default function NotificationCard({
  data,
  preview = false,
  onRead = noop,
  onDeleted = noop,
}: NotificationCardProps) {
  const auth = useAuth();

  // --- PROCEDURES ---

  const markAsRead = useAction(
    async () =>
      api.updateUsersNotifications(auth.id, {
        status: ENotificationStatus.READ,
        ids: [data.id],
      }),
    { onSuccess: onRead },
  );

  const deleteNotification = useAction(
    async () =>
      api.updateUsersNotifications(auth.id, {
        status: ENotificationStatus.DELETED,
        ids: [data.id],
      }),
    { onSuccess: onDeleted },
  );

  // --- ELEMENT SECTIONS ---

  const sections = {
    avatar: <Avatar>{avatarIcon(data.type)}</Avatar>,
    message: (
      <Stack flexGrow={1}>
        {data.title && (
          <Typography variant="subtitle2" gutterBottom>
            {data.title}
          </Typography>
        )}

        <Typography
          variant="body2"
          gutterBottom
          sx={{ ...(preview && mixins.ellipse({ lines: 2 })), whiteSpace: 'pre-line' }}
        >
          {decodeMessage(data)}
        </Typography>

        <Typography variant="caption" color="textSecondary">
          {new Date(data.createdAt).toLocaleString()}
        </Typography>
      </Stack>
    ),
    buttons: {
      read: (
        <Tooltip title="Mark as read">
          <EditIconButton onClick={() => markAsRead.call()}>
            <Icons.Done fontSize="small" />
          </EditIconButton>
        </Tooltip>
      ),
      delete: (
        <Tooltip title="Delete">
          <EditIconButton onClick={() => deleteNotification.call()}>
            <Icons.Close fontSize="small" />
          </EditIconButton>
        </Tooltip>
      ),
    },
  };

  return (
    <Stack direction="row" spacing={2} paddingY={1} width="100%">
      {sections.avatar}

      <Stack direction="row" flexGrow={1}>
        {sections.message}
        <Box>{!data.read ? sections.buttons.read : sections.buttons.delete}</Box>
      </Stack>
    </Stack>
  );
}

// ----- HELPERS -----

const avatarIconMap = new Map([
  [ENotificationType.SYSTEM, Icons.Report],
  [ENotificationType.SECURITY_ALERT, Icons.Security],
  [ENotificationType.GENERAL, Icons.Bell],
  [ENotificationType.TASK, Icons.Task],
  [ENotificationType.ANNOUNCEMENT, Icons.Tips],
]);

function avatarIcon(type: ENotificationType) {
  const Icon = avatarIconMap.get(type) || Icons.Notifications;
  return <Icon />;
}

const regex = { link: /<a>([^]+)<\/a>/ };
function decodeMessage(notification: DataType.UserNotificationDto) {
  const { message } = notification;

  if (regex.link.test(message))
    return message.split(regex.link).map((part, index) =>
      index % 2 === 0 ? (
        <Fragment key={index}>{part}</Fragment>
      ) : (
        <Link key={index} href={notification.link || '#'} underline="hover" color="primary">
          {part}
        </Link>
      ),
    );

  return message;
}

// ----- RULED COMPONENTS -----

const EditIconButton = withPermissionRule(IconButton, EPermission.NOTIFICATION, {
  action: EPermissionAction.UPDATE,
});
