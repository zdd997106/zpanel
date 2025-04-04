'use client';

import { forwardRef } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { Stack } from '@mui/material';

import { resetFields } from '@zpanel/ui/utils';
import { api, ServiceError } from 'src/service';
import { PasswordField } from 'src/components';

import { FieldValues, initialValues, schema } from './schema';

// ----------

export interface SignUpFormProps {
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;

  /** Custom action to update the password */
  customUpdateAction?: (values: FieldValues) => Promise<unknown>;
}

export default forwardRef(function SignUpForm(
  { customUpdateAction, onSubmit = noop, onSubmitError = noop }: SignUpFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const procedure = useAction(
    async (values: FieldValues) => (customUpdateAction ?? api.updateUserPassword)(values),
    {
      onSuccess: async () => {
        resetFields(methods);
      },
      onError: (error) => {
        if (error instanceof ServiceError && error.hasFieldErrors()) {
          return error.emitFieldErrors(methods);
        }
        onSubmitError(error);
      },
    },
  );

  return (
    <Form
      ref={ref}
      methods={methods}
      onSubmit={(values: FieldValues) => onSubmit(procedure.call(values))}
    >
      <Stack spacing={2} marginTop={1} sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Field name="password" dependencies={['confirmPassword']}>
          <PasswordField label="Password" fullWidth />
        </Field>

        <Field name="confirmPassword" dependencies={['password']}>
          <PasswordField label="Confirm Password" fullWidth />
        </Field>
      </Stack>
    </Form>
  );
});
