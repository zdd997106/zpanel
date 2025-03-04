'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
import { useSleep } from 'gexii/hooks';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import CONFIGS from 'src/configs';
import { useAction, useQueryParams } from 'src/hooks';
import SignInForm, { FieldValues } from 'src/forms/SignInForm';
import ForgetPasswordForm from 'src/forms/ForgotPasswordForm';

// ----------

export default function SignInView() {
  const [assignedValues, setAssignedValue] = useState<Partial<FieldValues> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [queryParams, { replace: replaceQueryParams }] = useQueryParams<{
    url: string;
    with: string;
  }>();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogs = useDialogs();
  const router = useRouter();
  const sleep = useSleep();

  // --- FUNCTION ---

  const returnToDashboard = () => {
    if (queryParams.url) return router.push(queryParams.url);
    return router.push(CONFIGS.routes.dashboard);
  };

  const resetError = () => setError(null);

  const submit = () => formRef.current?.requestSubmit();

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    resetError();
    returnToDashboard();
  });

  // --- PROCEDURES ---

  const requestToResetPassword = useAction(async () => {
    await dialogs.form(ForgetPasswordForm, 'Request To Reset Password', {
      onSubmitError: (error) => dialogs.alert('Request Failed', error.message),
    });
  });

  // --- EFFECTS ---

  useEffect(() => {
    if (!queryParams.with) return;

    try {
      const values = JSON.parse(Buffer.from(queryParams.with, 'base64').toString('ascii'));
      setAssignedValue(values);
      sleep().then(submit);
    } catch {
      replaceQueryParams({ with: '' });
    }
  }, [queryParams.with]);

  // --- ELEMENT SECTIONS ---

  const sections = {
    demoAccountNotice: (
      <Alert color="info" severity="info">
        <Typography variant="caption" sx={{ marginRight: 0.5 }}>
          Demo Account:
        </Typography>

        <Tooltip title="Click to apply">
          <Typography
            variant="caption"
            display="inline-block"
            sx={{ ':hover': { cursor: 'pointer', textDecoration: 'underline' } }}
            onClick={() => setAssignedValue({ ...configs.account })}
          >
            {' email: '}
            <b>{configs.account.email}</b>
            {', password: '}
            <b>{configs.account.password}</b>
          </Typography>
        </Tooltip>
      </Alert>
    ),

    errorAlert: (
      <Collapse in={!handleSubmit.isLoading() && !!error} unmountOnExit>
        <Alert color="error" severity="error" sx={{ typography: 'caption' }}>
          {error?.message}
        </Alert>
      </Collapse>
    ),
  };

  return (
    <Stack direction="column" spacing={3}>
      <Box>
        <Typography variant="h3" component="h1">
          Sign in to ZPanel
        </Typography>

        <Typography variant="caption">
          {'Want to join? '}
          <Link href={CONFIGS.routes.signUp} color="primary">
            Request to create an account
          </Link>
        </Typography>
      </Box>

      <Stack spacing={1}>
        {sections.demoAccountNotice}
        {sections.errorAlert}
      </Stack>

      <Box sx={{ textAlign: 'right' }}>
        <SignInForm
          ref={formRef}
          assignedValues={assignedValues}
          onSubmit={handleSubmit.call}
          onSubmitError={setError}
        />

        <Typography
          variant="caption"
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={requestToResetPassword.call}
        >
          Forgot password?
        </Typography>
      </Box>

      <Divider sx={{ border: 'none' }} />

      <Button size="large" loading={handleSubmit.isLoading()} onClick={submit}>
        Sign in
      </Button>
    </Stack>
  );
}

// ----- INTERNAL SETTINGS -----

const configs = {
  account: {
    email: 'demo@zdd997.com',
    password: 'demo1234',
  },
};
