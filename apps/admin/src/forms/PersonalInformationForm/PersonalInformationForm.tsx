'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetFields, resolveMedia } from '@zpanel/ui/utils';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { uploadable } from '@zpanel/ui/hoc';
import { Button, IconButton, Stack, TextField, Typography } from '@mui/material';

import { api, ServiceError } from 'src/service';
import { Avatar, StatusButton } from 'src/components';

import { FieldValues, initialValues, schema } from './schema';

const accept = 'image/jpeg, image/png, image/gif';
const UploadAvatar = uploadable(Avatar, { valueKey: 'src', accept });
const UploadButton = uploadable(Button, { valueKey: 'src', accept });

// ----------

export interface PersonalInformationFormProps {
  id: string;
  email: string;
  defaultValues?: FieldValues;
  resetRef?: React.Ref<() => void>;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function PersonalInformationForm(
  {
    id,
    email,
    defaultValues = initialValues,
    resetRef,
    onSubmit = noop,
    onSubmitError = noop,
  }: PersonalInformationFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const procedure = useAction(
    async () => {
      await resolveMedia.byPath(methods.getValues(), 'avatar');
      await methods.handleSubmit((values) => api.updateUser(id, values))();
    },
    {
      onError: (error) => {
        if (error instanceof ServiceError && error.hasFieldErrors()) {
          return error.emitFieldErrors(methods);
        }
        onSubmitError(error);
      },
    },
  );

  useImperativeHandle(resetRef, () => () => resetFields(methods));

  return (
    <Form ref={ref} methods={methods} onSubmit={() => onSubmit(procedure.call())}>
      <Stack spacing={3} sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton>
            <Field name="avatar" variant="pure" shouldForwardError={false}>
              <UploadAvatar height={120} width={120} />
            </Field>
          </IconButton>

          <Field name="avatar" shouldForwardError={false} helper="JPG, PNG, or GIF. Max 10MB">
            <UploadButton size="small">Change Avatar</UploadButton>
          </Field>
        </Stack>

        <Field name="name">
          <TextField label="User Name" fullWidth />
        </Field>

        <TextField label="User Email" value={email} fullWidth disabled />

        <Field name="bios">
          <TextField label="Bios" fullWidth multiline rows={5} />
        </Field>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack>
            <Typography variant="subtitle1" color="textSecondary">
              Notification via Email
            </Typography>
            <Typography variant="caption" color="textSecondary">
              You will receive copies of your notifications via your email address
            </Typography>
          </Stack>

          <Field name="emailNotify">
            <StatusButton sx={{ svg: { fontSize: '1.5em' } }} />
          </Field>
        </Stack>
      </Stack>
    </Form>
  );
});
