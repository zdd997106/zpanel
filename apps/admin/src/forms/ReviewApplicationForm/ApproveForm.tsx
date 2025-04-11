import { noop } from 'lodash';
import { forwardRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { MenuItem, Stack, TextField } from '@mui/material';

import { api, query, ServiceError } from 'src/service';

import { ApproveFieldValues, initialValues, schema } from './schema';

// ----------

export interface ApproveFormProps {
  id: string;
  onSubmit?: (submission: unknown) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function ApproveForm(
  { id, onSubmit = noop, onSubmitError = noop, ...props }: ApproveFormProps,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const methods = useForm({
    defaultValues: initialValues.approve,
    resolver: zodResolver(schema.approve),
  });

  const [roleOptions] = query.useRoleOptions();

  // --- PROCEDURES ---

  const procedure = useAction(
    async (values: ApproveFieldValues) => api.approveApplication(id, values),
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
      role: (
        <Field name="role">
          <TextField label="Assign Role" name="role" select fullWidth>
            {roleOptions?.length === 0 && <MenuItem disabled>Loading...</MenuItem>}
            {roleOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      ),
    },
  };

  return (
    <Stack sx={{ marginTop: 1 }}>
      <Form
        methods={methods}
        ref={ref}
        onSubmit={(values) => onSubmit(procedure.call(values).then(() => true))}
        {...props}
      >
        {sections.fields.role}
      </Form>
    </Stack>
  );
});
