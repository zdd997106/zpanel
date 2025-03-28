'use client';

import { get, includes, noop } from 'lodash';
import { DataType, EApplicationStatus } from '@zpanel/core';
import { useAction } from 'gexii/hooks';
import { useDialogs } from 'gexii/dialogs';
import { Button, Stack, Typography } from '@mui/material';

import Icons from 'src/icons';

import ApproveForm from './ApproveForm';
import RejectForm from './RejectForm';

// ----------

export interface ReviewApplicationProps {
  application: DataType.ApplicationDto;
  onClose?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function ReviewApplication({
  application,
  onClose: close = noop,
  onApprove = noop,
  onReject = noop,
}: ReviewApplicationProps) {
  const dialogs = useDialogs();

  // --- PROCEDURES ---

  const approveApplication = useAction(async () => {
    dialogs.form(ApproveForm, 'Approve Application', {
      id: application.id,
      onOk: async () => {
        await onApprove();
        await close();
      },
    });
  });

  const rejectApplication = useAction(async () => {
    dialogs.form(RejectForm, 'Reject Application', {
      id: application.id,
      onOk: async () => {
        await onReject();
        await close();
      },
    });
  });

  return (
    <Stack alignItems="center">
      <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
        {(
          [
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Introduction', key: 'introduction' },
            { label: 'Status', key: 'status' },
            { label: 'Reviewer', key: 'reviewer.name' },
            { label: 'Created At', key: 'createdAt' },
            { label: 'Update At', key: 'updatedAt' },
          ] as const
        ).map((item) => (
          <Stack direction="row" key={item.key}>
            <Typography variant="subtitle1" width={120} flexShrink={0}>
              {item.label}
            </Typography>
            <Typography variant="body1" whiteSpace="pre-line">
              {display(get(application, item.key), item.key)}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={3} justifyContent="center" marginTop={5}>
        <Button color="success" startIcon={<Icons.Check />} onClick={approveApplication.call}>
          Approve
        </Button>

        <Button color="error" startIcon={<Icons.Remove />} onClick={rejectApplication.call}>
          Reject
        </Button>
      </Stack>
    </Stack>
  );
}

function display(value: unknown, key: string) {
  if (includes(['createdAt', 'updatedAt'], key)) return new Date(String(value)).toLocaleString();
  if (includes(['status'], key)) return EApplicationStatus[value as never];

  return String(value || '--');
}
