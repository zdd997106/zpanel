'use client';

import { Field } from 'gexii/fields';
import { Grid2 as Grid, TextField } from '@mui/material';

// ----------

export interface SelectionSectionProps {
  name: string;
}

export default function TitlesSection({ name }: SelectionSectionProps) {
  // --- FUNCTIONS ---

  const childPath = (childName: string) => `${name}.${childName}`;

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Field name={childPath('title')} label="Title">
          <TextField variant="standard" fullWidth />
        </Field>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Field name={childPath('subtitle')} label="Subtitle">
          <TextField fullWidth multiline rows={3} sx={{ marginTop: 1 }} />
        </Field>
      </Grid>
    </>
  );
}
