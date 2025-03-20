'use client';

import { forwardRef } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { Stack, TextField } from '@mui/material';

import { resetFields } from 'src/utils';
import { api, ServiceError } from 'src/service';

import { FieldValues, initialValues, schema } from './schema';

// ----------

export interface UpdateEmailFormProps {
  id: string;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function UpdateEmailForm(
  { id, onSubmit = noop, onSubmitError = noop }: UpdateEmailFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const procedure = useAction(
    async (values: FieldValues) => api.requestToUpdateUserEmail(id, values),
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
      <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Field name="email">
          <TextField label="Email" fullWidth />
        </Field>
      </Stack>
    </Form>
  );
});
