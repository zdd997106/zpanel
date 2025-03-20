'use client';

import { styled } from '@mui/material';

import { UploadField } from 'src/components';
import { withDefaultProps } from 'src/hoc';

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
