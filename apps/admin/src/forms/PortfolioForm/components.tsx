'use client';

import { withDefaultProps } from '@zpanel/ui/hoc';
import { styled } from '@mui/material';

import { UploadField } from 'src/components';

// ----- COMPONENT: DOCUMENT FIELD -----

export const DocumentField = styled(
  withDefaultProps(UploadField, { accept: 'application/pdf,.doc,.docx,.txt' }),
)(() => ({
  width: 136,
  height: 102,
}));

// ----- COMPONENT: IMAGE FIELD -----

export const ImageField = withDefaultProps(
  styled(UploadField.Image)(() => ({})),
  {
    width: 136,
    height: 102,
  },
);
