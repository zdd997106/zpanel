'use client';

import { forwardRef, useEffect } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'gexii/fields';
import { Stack, TextField } from '@mui/material';

import { api, ServiceError } from 'src/service';
import { useAction } from 'src/hooks';
import { PasswordField } from 'src/components';

import { FieldValues, initialValues, schema } from './schema';

// ----------

export interface SignInFormProps {
  assignedValues?: Partial<FieldValues> | null;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function SignInForm(
  { assignedValues, onSubmit = noop, onSubmitError = noop }: SignInFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const procedure = useAction(async (values: FieldValues) => api.signIn(values), {
    onError: (error) => {
      if (error instanceof ServiceError && error.hasFieldErrors()) {
        return error.emitFieldErrors(methods);
      }
      onSubmitError(error);
    },
  });

  // --- EFFECTS ---

  useEffect(() => {
    if (assignedValues) {
      methods.reset({ ...methods.getValues(), ...assignedValues });
    }
  }, [assignedValues]);

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(procedure.call(values))}
    >
      <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Field name="email">
          <TextField label="Email Address" fullWidth />
        </Field>

        <Field name="password">
          <PasswordField label="Password" fullWidth />
        </Field>
      </Stack>
    </Form>
  );
});
