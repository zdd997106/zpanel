'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { ENotificationAudience, ENotificationType } from '@zpanel/core';
import { includes, noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import {
  Checkbox,
  Collapse,
  Divider,
  MenuItem,
  MenuItemProps,
  Stack,
  TextField,
} from '@mui/material';

import { resetFields } from 'src/utils';
import configs from 'src/configs';
import { api, ServiceError } from 'src/service';
import { useRoleOptions, useUserOptions } from 'src/service/query';

import { FieldValues, initialValues, schema } from './schema';

// ----------

export interface BroadcastNotificationFormProps {
  resetRef?: React.Ref<() => void>;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function BroadcastNotificationForm(
  { resetRef, onSubmit = noop, onSubmitError = noop }: BroadcastNotificationFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  const audience = methods.watch('audience');

  const [roleOptions, { refetch: fetchRoleOptions }] = useRoleOptions({ enabled: false });
  const [userOptions, { refetch: fetchUserOptions }] = useUserOptions({ enabled: false });

  // --- FUNCTIONS ---

  const reset = () => {
    resetFields(methods);
  };

  // --- HANDLERS ---

  const handleAudienceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) as ENotificationAudience;

    switch (value) {
      case ENotificationAudience.ROLE:
        fetchRoleOptions();
        break;

      case ENotificationAudience.USER:
        fetchUserOptions();
        break;

      default:
    }

    methods.setValue('audienceValue', []);
  };

  function renderAudienceValueField() {
    switch (audience) {
      case ENotificationAudience.ROLE:
        return sections.fields.audienceValue.role;

      case ENotificationAudience.USER:
        return sections.fields.audienceValue.users;

      default:
        return sections.fields.audienceValue.placeholder;
    }
  }

  // --- PROCEDURE ---

  const procedure = useAction(async (values: FieldValues) => api.broadcastNotification(values), {
    onError: (error) => {
      if (error instanceof ServiceError && error.hasFieldErrors()) {
        return error.emitFieldErrors(methods);
      }
      onSubmitError(error);
    },
  });

  // --- IMPERATIVE HANDLES ---

  useImperativeHandle(resetRef, () => reset);

  // --- ELEMENT SECTIONS ---

  const sections = {
    fields: {
      title: (
        <Field name="title">
          <TextField label="Title" fullWidth />
        </Field>
      ),

      message: (
        <Field name="message">
          <TextField label="Message" fullWidth multiline rows={5} />
        </Field>
      ),

      link: (
        <Field
          name="link"
          helper="The URL will be embedded as the link of <a>...</a> in the message content."
          slotProps={{ helperText: { sx: { marginLeft: 1.5 } } }}
        >
          <TextField label="Link" fullWidth />
        </Field>
      ),

      type: (
        <Field name="type">
          <TextField label="Type" select fullWidth>
            {typeOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      ),

      audience: (
        <Field name="audience">
          <TextField label="Audience" select fullWidth onChange={handleAudienceChange}>
            {audienceOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      ),

      audienceValue: {
        role: (
          <Field name="audienceValue">
            <TextField
              label="Pick Roles"
              select
              fullWidth
              slotProps={{ select: { multiple: true } }}
            >
              {roleOptions.map(({ label, value }) => (
                <MenuItemWithCheckbox key={value} value={value}>
                  {label}
                </MenuItemWithCheckbox>
              ))}
            </TextField>
          </Field>
        ),

        users: (
          <Field name="audienceValue">
            <TextField
              label="Pick Users"
              select
              fullWidth
              slotProps={{ select: { multiple: true } }}
              sx={{ marginTop: 1, input: { width: '100% !important' } }}
            >
              {userOptions.map(({ label, value }) => (
                <MenuItemWithCheckbox key={value} value={value}>
                  {label}
                </MenuItemWithCheckbox>
              ))}
            </TextField>
          </Field>
        ),

        placeholder: <TextField label="Audience Value" disabled />,
      },
    },
  };

  return (
    <Form ref={ref} methods={methods} onSubmit={(values) => onSubmit(procedure.call(values))}>
      <Stack spacing={3} sx={{ flexGrow: 1, paddingTop: 1, justifyContent: 'center' }}>
        {sections.fields.title}
        {sections.fields.message}

        <Field name="message" variant="pure">
          {({ field }) => (
            <Collapse in={containsATag(field.value)} sx={{ width: '100%' }}>
              {sections.fields.link}
            </Collapse>
          )}
        </Field>

        <Divider sx={{ typography: 'caption' }}>Broadcast Setting</Divider>

        {sections.fields.type}

        {sections.fields.audience}

        <Field name="audience" variant="pure">
          {({ field }) => (
            <Collapse sx={{ width: '100%' }} in={hasAudienceValue(field.value)}>
              {renderAudienceValueField()}
            </Collapse>
          )}
        </Field>
      </Stack>
    </Form>
  );
});

// ----- CONSTANTS -----

const typeLabelMap = configs.labelMap.notificationType;

const typeOptions = [
  ENotificationType.SYSTEM,
  ENotificationType.SECURITY_ALERT,
  ENotificationType.GENERAL,
  ENotificationType.TASK,
  ENotificationType.ANNOUNCEMENT,
].map((value) => ({ label: typeLabelMap.get(value), value }));

const audienceLabelMap = configs.labelMap.notificationAudience;

const audienceOptions = [
  ENotificationAudience.ALL,
  ENotificationAudience.ADMIN,
  ENotificationAudience.ROLE,
  ENotificationAudience.USER,
].map((value) => ({ label: audienceLabelMap.get(value), value }));

// ----- INTERNAL COMPONENTS -----

function MenuItemWithCheckbox({ selected, children, ...props }: MenuItemProps) {
  return (
    <MenuItem {...props} selected={selected}>
      <Checkbox checked={selected} size="small" />
      {children}
    </MenuItem>
  );
}

// ----- HELPERS -----

function containsATag(value: string) {
  return /<a>[^]+<\/a>/.test(value);
}

function hasAudienceValue(audience: ENotificationAudience) {
  return includes([ENotificationAudience.ROLE, ENotificationAudience.USER], audience);
}
