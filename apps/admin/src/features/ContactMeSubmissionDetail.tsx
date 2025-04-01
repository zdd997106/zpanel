'use client';

import { DataType } from '@zpanel/core';
import { Stack, Typography } from '@mui/material';

// ----------

export interface ContactMeSubmissionDetailProps {
  data: DataType.ContractMeForm.SubmissionDetailDto;
}

export default function ContactMeSubmissionDetail({ data }: ContactMeSubmissionDetailProps) {
  return (
    <Stack spacing={2} paddingX={2}>
      {[
        { label: 'Name', value: data.name },
        { label: 'Email', value: data.email },
        { label: 'Submitted At', value: new Date(data.createdAt).toLocaleString() },
        { label: 'Budget', value: data.budget || '--' },
        { label: 'Service', value: data.service || '--' },
        { label: 'Description', value: data.description || '--' },
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
