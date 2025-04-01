'use client';

import { mixins } from 'gexii/theme';
import { uploadable } from '@zpanel/ui/hoc';
import { Card, Stack, styled, Typography } from '@mui/material';
import DocumentIcon from '@mui/icons-material/DescriptionOutlined';
import UploadIcon from '@mui/icons-material/CloudUploadOutlined';

import { ImageField } from './ImageField';

// ----- COMPONENT: DOCUMENT FIELD -----

export interface UploadFieldProps extends React.ComponentProps<typeof DocumentCard> {
  error?: boolean;
}

export default function UploadField({ error, value, ...props }: UploadFieldProps) {
  const Icon = value ? DocumentIcon : UploadIcon;

  return (
    <DocumentCard
      {...props}
      sx={mixins.combineSx(error ? { borderColor: 'error.light' } : {}, props.sx)}
    >
      <Stack height="100%" alignItems="center" justifyContent="center" spacing={0.5}>
        <Icon fontSize="large" color="action" />

        <Typography variant="caption" color="textSecondary" sx={mixins.ellipse()}>
          {value?.name || 'Click to upload'}
        </Typography>
      </Stack>
    </DocumentCard>
  );
}

UploadField.Image = ImageField;

// ----- INTERNAL COMPONENTS -----

const StyledCard = styled(Card)(({ theme }) => ({
  border: 'solid 2px',
  padding: theme.spacing(1),
  borderColor: theme.palette.divider,
  background: theme.palette.divider,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  marginTop: theme.spacing(1),
}));

const DocumentCard = uploadable(StyledCard, {
  valueKey: 'value',
});
