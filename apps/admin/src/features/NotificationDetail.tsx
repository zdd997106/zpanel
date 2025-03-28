'use client';

import { includes } from 'lodash';
import { DataType, ENotificationStatus } from '@zpanel/core';
import { useDialogs } from 'gexii/dialogs';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';

import configs from 'src/configs';
import Icons from 'src/icons';

const { notificationType: typeLabelMap, notificationAudience: audienceLabelMap } = configs.labelMap;

// ----------

export interface NotificationDetailProps {
  data: DataType.NotificationDetailDto;
}

export default function NotificationDetail({ data }: NotificationDetailProps) {
  const dialogs = useDialogs();

  // --- FUNCTIONS ---

  const openRecipients = () => {
    dialogs.view(Recipients, 'Recipients', { recipients: data.recipients, maxWidth: 'xs' });
  };

  return (
    <Stack spacing={2} paddingX={2}>
      {[
        { label: 'Title', value: data.title },
        { label: 'Type', value: typeLabelMap.get(data.type) },
        { label: 'Time', value: new Date(data.createdAt).toLocaleString() },
        {
          label: 'Audience',
          value: (
            <>
              <Box component="span" marginRight={1}>
                {audienceLabelMap.get(data.audience)}
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icons.Users />}
                sx={{ typography: 'caption', display: 'inline-flex' }}
                onClick={() => openRecipients()}
              >
                Recipients
              </Button>
            </>
          ),
        },
        { label: 'Message', value: data.message },
      ].map(({ label, value }) => (
        <Stack key={label} direction="row" spacing={2}>
          <Typography variant="subtitle2" width={{ xs: 80, sm: 120 }} flexShrink={0}>
            {label}
          </Typography>

          <Typography variant="body2" whiteSpace="pre-line">
            {value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

// ----- INTERNAL COMPONENTS -----

type Recipient = DataType.NotificationDetailDto['recipients'][number];

interface RecipientsProps {
  recipients: Recipient[];
}

function Recipients({ recipients }: RecipientsProps) {
  return (
    <Stack spacing={2}>
      {recipients.map((user) => (
        <Stack key={user.id} direction="row" alignItems="center" spacing={1}>
          <Box width={80}>
            {user.status === ENotificationStatus.READ && (
              <Chip label="Read" color="info" variant="outlined" />
            )}

            {user.status === ENotificationStatus.DELETED && (
              <Chip label="Deleted" variant="outlined" disabled />
            )}

            {includes([ENotificationStatus.SEND, ENotificationStatus.RECEIVED], user.status) && (
              <Chip label="Send" color="default" variant="outlined" />
            )}
          </Box>
          <Stack>
            <Typography>{user.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {user.email}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
