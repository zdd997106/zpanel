import { noop } from 'lodash';
import { forwardRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RejectApplicationDto } from '@zpanel/core';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { Stack, TextField } from '@mui/material';

import { api, ServiceError } from 'src/service';

import { initialValues, schema } from './schema';

// ----------

export interface RejectFormProps {
  id: string;
  onSubmit?: (submission: unknown) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function RejectForm(
  { id, onSubmit = noop, onSubmitError = noop, ...props }: RejectFormProps,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const methods = useForm({
    defaultValues: initialValues.reject,
    resolver: zodResolver(schema.reject),
  });

  // --- PROCEDURES ---

  const procedure = useAction(
    async (values: RejectApplicationDto) => api.rejectApplication(id, values),
    {
      onError: (error) => {
        if (error instanceof ServiceError && error.hasFieldErrors()) {
          return error.emitFieldErrors(methods);
        }
        onSubmitError(error);
      },
    },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    fields: {
      reason: (
        <Field name="reason">
          <TextField label="Reason" name="reason" fullWidth multiline rows={3} />
        </Field>
      ),
    },
  };

  return (
    <Form
      methods={methods}
      ref={ref}
      onSubmit={(values) => onSubmit(procedure.call(values).then(() => true))}
      {...props}
    >
      <Stack sx={{ marginTop: 1 }}>{sections.fields.reason}</Stack>
    </Form>
  );
});
