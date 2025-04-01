'use client';

import { useFieldArray } from 'react-hook-form';
import { Field } from 'gexii/fields';
import { withDefaultProps } from '@zpanel/ui/hoc';
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

import { ImageField } from '../components';
import { initialSelectionItem } from '../schema';

// ----------

export interface ProjectsSectionProps {
  name: 'selectionOfWorks.items' | 'selectionOfIdeas.items';
}

export default function ProjectsSection({ name }: ProjectsSectionProps) {
  const { fields, remove: removeField, append: appendField } = useFieldArray({ name });

  // --- FUNCTIONS ---

  const childPath = (childName: string, index: number) => `${name}.${index}.${childName}`;

  return (
    <>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" color="textSecondary">
            Projects
          </Typography>

          <IconButton size="small" onClick={() => appendField(initialSelectionItem)}>
            <Icons.Add color="action" />
          </IconButton>
        </Stack>
      </Grid>

      {fields.length === 0 && (
        <Grid size={12}>
          <Typography variant="caption" color="textDisabled">
            No projects added
          </Typography>
        </Grid>
      )}

      {fields.map((field, i) => (
        <Grid key={field.id} position="relative" size={{ xs: 12, sm: 6 }}>
          <StyledProjectCard>
            <Stack spacing={2}>
              <Field name={childPath('title', i)} label="Title">
                <TextField variant="standard" fullWidth />
              </Field>
              <Field name={childPath('role', i)} label="Role">
                <TextField variant="standard" fullWidth />
              </Field>
              <Field name={childPath('description', i)} label="Description">
                <TextField fullWidth multiline rows={5} sx={{ marginTop: 1 }} />
              </Field>
              <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={3}>
                <Field name={childPath('img', i)} label="Cover Image">
                  <ImageField />
                </Field>
                <Stack spacing={1} flexGrow={1}>
                  <Field name={childPath('link.website', i)} label="Website">
                    <TextField variant="standard" fullWidth />
                  </Field>
                  <Field name={childPath('link.github', i)} label="GitHub">
                    <TextField variant="standard" fullWidth />
                  </Field>
                </Stack>
              </Stack>
            </Stack>

            <CloseButton size="small" onClick={() => removeField(i)} />
          </StyledProjectCard>
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
