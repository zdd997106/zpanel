'use client';

import { useFieldArray } from 'react-hook-form';
import { withDefaultProps } from '@zpanel/ui/hoc';
import { Field } from 'gexii/fields';
import {
  Card,
  Grid2 as Grid,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';

import Icons from 'src/icons';

import { initialServiceItem } from '../schema';

// ----------

export interface ServiceSectionProps {
  name: 'services.items';
}

export default function ServicesSection({ name }: ServiceSectionProps) {
  const { fields, remove: removeField, append: appendField } = useFieldArray({ name });

  // --- FUNCTIONS ---

  const childPath = (childName: string, index: number) => `${name}.${index}.${childName}`;

  return (
    <>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" color="textSecondary">
            Items
          </Typography>

          <IconButton size="small" onClick={() => appendField(initialServiceItem)}>
            <Icons.Add color="action" />
          </IconButton>
        </Stack>
      </Grid>

      {fields.length === 0 && (
        <Grid size={12}>
          <Typography variant="caption" color="textDisabled">
            No service added
          </Typography>
        </Grid>
      )}

      {fields.map((field, i) => (
        <Grid key={field.id} position="relative" size={{ xs: 12, sm: 6, lg: 4 }}>
          <StyledProjectCard>
            <Stack spacing={2}>
              <Field name={childPath('title', i)} label="Title">
                <TextField variant="standard" fullWidth />
              </Field>

              <Field name={childPath('icon', i)} label="Icon Name">
                <TextField variant="standard" fullWidth />
              </Field>

              <Field name={childPath('description', i)} label="Subtitle">
                <TextField fullWidth multiline rows={5} sx={{ marginTop: 1 }} />
              </Field>
            </Stack>
          </StyledProjectCard>

          <CloseButton onClick={() => removeField(i)} />
        </Grid>
      ))}
    </>
  );
}

// ----- STYLED -----

const StyledProjectCard = styled(withDefaultProps(Stack<typeof Card>, { component: Card }))(
  ({ theme }) => ({
    padding: theme.spacing(4),
    minHeight: 250,
    height: '100%',
    border: 'solid 2px',
    borderColor: theme.palette.divider,
  }),
);

const CloseButton = styled(
  withDefaultProps(IconButton, { size: 'small', children: <Icons.Close fontSize="small" /> }),
)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
}));
