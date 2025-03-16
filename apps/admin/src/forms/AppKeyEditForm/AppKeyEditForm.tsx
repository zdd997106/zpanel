'use client';

import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { EAppKeyStatus } from '@zpanel/core';
import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { useDialogs } from 'gexii/dialogs';
import { Field, Form } from 'gexii/fields';
import {
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { api, ServiceError } from 'src/service';
import { StatusButton } from 'src/components';

import { FieldValues, initialValues, schema } from './schema';
import { PatternField } from './components';

const AppKeyStatusButton = StatusButton.config(EAppKeyStatus.ENABLED, EAppKeyStatus.DISABLED);

// ----------

export interface RoleEditFormProps {
  id?: string;
  defaultValues?: Partial<FieldValues>;
  onSubmit?: (submission: Promise<unknown>) => void;
}

export default forwardRef(function RoleEditForm(
  { id, defaultValues = initialValues, onSubmit = noop }: RoleEditFormProps,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const dialogs = useDialogs();

  const methods = useForm<FieldValues>({
    defaultValues: { ...initialValues, ...defaultValues },
    resolver: zodResolver(schema),
  });

  const status = methods.watch('status');
  const expiresAt = methods.watch('expiresAt');

  // --- FUNCTIONS ---

  const isEnabled = () => status === EAppKeyStatus.ENABLED;

  // --- PROCEDURES ---

  const procedure = useAction(
    async (values: FieldValues) => {
      if (id) await api.updateAppKey(id, values);
      else
        await api.grantAppKey({
          ...values,
          expiresAt: values.expiration ? new Date(Date.now() + values.expiration) : null,
        });
    },
    {
      onError: (error) => {
        if (error instanceof ServiceError) return error.emitFieldErrors(methods);
        dialogs.alert('Error', error.message);
      },
    },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    fields: {
      name: (
        <Field name="name" label="App Key Name">
          <TextField fullWidth sx={{ marginTop: 1 }} />
        </Field>
      ),
      allowPaths: (
        <Field
          name="allowPaths"
          label="Allowed Paths"
          type={(_event, value) => value}
          shouldForwardError={false}
          errorMessageGetter={childrenErrorGetter}
        >
          <PatternField placeholder="GET: /projects/example/1" transform={allowPathTransform} />
        </Field>
      ),
      expiration: (
        <Field name="expiration" label="Expiration">
          <TextField fullWidth select sx={{ marginTop: 1 }}>
            {expirationOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      ),
      expirationNotice: (
        <Stack>
          <FormLabel>Expires At</FormLabel>
          <TextField
            fullWidth
            disabled
            value={expiresAt ? new Date(expiresAt).toLocaleString() : 'Never expires'}
            sx={{ marginTop: 1 }}
          />
        </Stack>
      ),
      status: (
        <Field name="status" shouldForwardError={false} label="Status">
          <FormControlLabel
            sx={{ height: 56, marginTop: 1 }}
            control={<AppKeyStatusButton sx={{ paddingTop: 1, marginRight: 1 }} />}
            label={isEnabled() ? 'Enabled' : 'Disabled'}
          />
        </Field>
      ),
    },
  };

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(procedure.call(values))}
    >
      <Grid container spacing={2} paddingTop={1}>
        <Grid size={{ xs: 12 }}>{sections.fields.name}</Grid>
        <Grid size={{ xs: 12 }}>{sections.fields.allowPaths}</Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          {id ? sections.fields.expirationNotice : sections.fields.expiration}
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>{sections.fields.status}</Grid>
      </Grid>
    </Form>
  );
});

// ----- HELPERS -----

function childrenErrorGetter(error: unknown) {
  if (Array.isArray(error)) return error[0]?.message;
  if (error instanceof Error) return error.message;
  return String(error);
}

function allowPathTransform(text: string) {
  let [method, path] = text.split(':').map((part) => part.trim());
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    method = 'GET';
    path = text;
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return `${method.toUpperCase()}: ${path.toLocaleLowerCase().split(/\s/)[0]}`;
}

// ----- CONSTANTS -----

const expirationOptions = [
  { value: 1000 * 60 * 60 * 6, label: '6 Hours' },
  { value: 1000 * 60 * 60 * 24, label: '1 Day' },
  { value: 1000 * 60 * 60 * 24 * 7, label: '1 Week' },
  { value: 1000 * 60 * 60 * 24 * 7 * 30, label: '1 Month' },
  { value: 1000 * 60 * 60 * 24 * 7 * 30 * 6, label: '6 Months' },
  { value: 1000 * 60 * 60 * 24 * 7 * 365, label: '1 Year' },
  { value: 0, label: 'Never' },
];
