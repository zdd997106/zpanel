'use client';

import { forwardRef } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { Stack, TextField } from '@mui/material';

import { api, ServiceError } from 'src/service';

import { FieldValues, initialValues, schema } from './schema';

// ----------

export interface ForgetPasswordFormProps {
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function ForgetPasswordForm(
  { onSubmit = noop, onSubmitError = noop }: ForgetPasswordFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const dialogs = useDialogs();
  const methods = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const procedure = useAction(async (values: FieldValues) => api.requestToResetPassword(values), {
    onSuccess: async () => {
      await dialogs.alert(
        'Password Reset Requested',
        'Please check your email and follow the instructions to reset your password.',
      );
    },
    onError: (error) => {
      if (error instanceof ServiceError && error.hasFieldErrors()) {
        return error.emitFieldErrors(methods);
      }
      onSubmitError(error);
    },
  });

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(procedure.call(values))}
    >
      <Stack spacing={2} sx={{ marginTop: 1 }}>
        <Field name="email">
          <TextField label="Email Address" fullWidth />
        </Field>
      </Stack>
    </Form>
  );
});
