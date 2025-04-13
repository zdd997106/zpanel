'use client';

import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef } from 'react';
import { EUserStatus } from '@zpanel/core';
import { resolveMedia } from '@zpanel/ui/utils';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { uploadable } from '@zpanel/ui/hoc';
import { Field, Form } from 'gexii/fields';
import { FormHelperText, IconButton, MenuItem, Stack, TextField } from '@mui/material';

import { api, query, ServiceError } from 'src/service';
import { Avatar, PasswordField } from 'src/components';

import { FieldValues, initialValues, schema } from './schema';

const AvatarField = uploadable(Avatar, { valueKey: 'src', accept: 'image/*' });

// ----------

export interface UserEditFormProps {
  id?: string;
  defaultValues?: Partial<FieldValues>;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function UserEditForm(
  { id, defaultValues = initialValues, onSubmit = noop, onSubmitError = noop }: UserEditFormProps,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const [roleOptions] = query.useRoleOptions();
  const methods = useForm<FieldValues>({
    defaultValues: { ...initialValues, ...defaultValues },
    resolver: zodResolver(id ? schema.update : schema.create),
  });

  // --- FUNCTIONS ---

  const isCreateMode = () => !id;

  // --- PROCEDURES ---

  const procedure = useAction(
    async () => {
      await resolveMedia.byPath(methods.getValues(), 'avatar');
      await methods.handleSubmit(async (values) => {
        if (id) await api.updateUser(id, values);
        else await api.createUser({ ...values, password: values.password! });
      })();
    },
    {
      onError: (error) => {
        if (error instanceof ServiceError && error.hasFieldErrors())
          return error.emitFieldErrors(methods);
        onSubmitError(error);
      },
    },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    fields: {
      avatar: (
        <IconButton>
          <Field name="avatar" shouldForwardError={false}>
            <AvatarField height={100} width={100} />
          </Field>
        </IconButton>
      ),
      name: (
        <Field name="name">
          <TextField fullWidth label="Name" />
        </Field>
      ),
      account: (
        <Field name="account">
          <TextField fullWidth label="Account" />
        </Field>
      ),
      email: (
        <Field name="email">
          {({ field }) => (
            <TextField
              fullWidth
              label="Email"
              disabled
              value={field.value || 'No email connected'}
            />
          )}
        </Field>
      ),
      bios: (
        <Field name="bios">
          <TextField fullWidth multiline rows={4} label="Bios" />
        </Field>
      ),
      role: (
        <Field name="role" slotProps={{ root: { flexGrow: 1 } }}>
          <TextField fullWidth label="Role" select>
            {roleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      ),
      status: (
        <Field name="status">
          <TextField select label="Status" sx={{ width: { xs: '100%', sm: 116 } }}>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
                <FormHelperText>{option.helper}</FormHelperText>
              </MenuItem>
            ))}
          </TextField>
        </Field>
      ),
      password: (
        <Field name="password">
          <PasswordField fullWidth label={isCreateMode() ? 'Password' : 'Reset Password'} />
        </Field>
      ),
    },
  };

  return (
    <Form ref={ref} methods={methods} onSubmit={() => onSubmit(procedure.call())}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 3, md: 2 }}
          alignItems="center"
          paddingTop={1}
        >
          {sections.fields.avatar}
          <Stack direction="column" spacing={3} flexGrow={1} width={{ xs: '100%', sm: 'auto' }}>
            {sections.fields.name}
            {sections.fields.account}
          </Stack>
        </Stack>

        {!isCreateMode() && sections.fields.email}

        {sections.fields.bios}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, md: 2 }}>
          {sections.fields.status}
          {sections.fields.role}
        </Stack>

        {sections.fields.password}
      </Stack>
    </Form>
  );
});

// ----- SETTINGS -----

const statusOptions = [
  { label: 'Active', value: EUserStatus.ACTIVE, helper: '' },
  { label: 'Inactive', value: EUserStatus.INACTIVE },
  { label: 'Blocked', value: EUserStatus.BLOCKED },
];
