'use client';

import { forwardRef } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'gexii/fields';
import { Stack, TextField } from '@mui/material';

import { api, ServiceError } from 'src/service';
import { useAction } from 'src/hooks';

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
  const methods = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const procedure = useAction(async (values: FieldValues) => api.requestToResetPassword(values), {
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
