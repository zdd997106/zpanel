import { noop } from 'lodash';
import { DataType, ENotificationStatus, ENotificationType } from '@zpanel/core';
import { useAction } from 'gexii/hooks';
import { Fragment } from 'react';
import { Box, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';

import { api } from 'src/service';
import { mixins } from 'src/theme';
import { useAuth } from 'src/guards';
import Icons from 'src/icons';
import { Avatar } from 'src/components';

// ----------

interface NotificationCardProps {
  data: DataType.UserNotificationDto;
  onRead?: () => void;
  onDeleted?: () => void;
}

export default function NotificationCard({
  data,
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
      <Stack>
        {data.title && (
          <Typography variant="subtitle2" gutterBottom>
            {data.title}
          </Typography>
        )}

        <Typography variant="body2" gutterBottom sx={mixins.ellipse({ lines: 2 })}>
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
          <IconButton onClick={() => markAsRead.call()}>
            <Icons.Done fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
      delete: (
        <Tooltip title="Delete" onClick={() => deleteNotification.call()}>
          <IconButton>
            <Icons.Close fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  };

  return (
    <Stack direction="row" spacing={2}>
      {sections.avatar}

      <Stack direction="row">
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
