'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
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

import { ROUTES } from 'src/configs';
import { useAction } from 'src/hooks';

import SignInForm, { FieldValues } from 'src/forms/SignInForm';
import ForgetPasswordForm from 'src/forms/ForgotPasswordForm';
import { useQueryParams } from 'src/hooks/useQueryParams';

// ----------

export default function SignInView() {
  const [assignedValues, setAssignedValue] = useState<Partial<FieldValues> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [queryParams] = useQueryParams<{ url: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogs = useDialogs();
  const router = useRouter();

  // --- FUNCTION ---

  const returnToDashboard = () => {
    if (queryParams.url) return router.push(queryParams.url);
    return router.push(`${ROUTES.DASHBOARD}`);
  };

  // --- HANDLERS ---

  const handleSubmit = useAction(
    async (submission: Promise<unknown>) => {
      await submission;
    },
    { onSuccess: returnToDashboard },
  );

  // --- PROCEDURES ---

  const requestToResetPassword = useAction(async () => {
    await dialogs.form(ForgetPasswordForm, 'Request To Reset Password', {
      onSubmitError: (error) => dialogs.alert('Request Failed', error.message),
    });
  });

  return (
    <Stack direction="column" spacing={3}>
      <Box>
        <Typography variant="h2" component="h1">
          Sign in to ZPanel
        </Typography>

        <Typography variant="caption">
          {'Want to join? '}
          <Link href={ROUTES.SIGN_UP} color="primary">
            Request to create an account
          </Link>
        </Typography>
      </Box>

      <Stack spacing={1}>
        <DemoAccountNotice onClick={() => setAssignedValue({ ...DEMO_ACCOUNT_DATA })} />

        <Collapse in={!handleSubmit.isLoading() && !!error} unmountOnExit>
          <Alert color="error" severity="error">
            <Typography variant="caption">{error?.message}</Typography>
          </Alert>
        </Collapse>
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

      <Button
        size="large"
        loading={handleSubmit.isLoading()}
        onClick={() => formRef.current?.requestSubmit()}
      >
        Sign in
      </Button>
    </Stack>
  );
}

// ----- INTERNAL SETTINGS -----

const DEMO_ACCOUNT_DATA = {
  email: 'demo@zdd997.com',
  password: 'demo1234',
};

// ----- INTERNAL COMPONENTS -----

interface DemoAccountNoticeProps {
  onClick: React.MouseEventHandler;
}

const DemoAccountNotice = ({ onClick }: DemoAccountNoticeProps) => (
  <Alert color="info" severity="info">
    <Typography variant="caption">
      <Box display="inline-block" sx={{ marginRight: 0.7 }}>
        Demo Account
      </Box>

      <Tooltip title="Click to apply">
        <Box
          component="span"
          display="inline-block"
          paddingX={0.3}
          sx={{ ':hover': { cursor: 'pointer', textDecoration: 'underline' } }}
          onClick={onClick}
        >
          <b>{' email: '}</b>
          {DEMO_ACCOUNT_DATA.email}
          <b>{' , password: '}</b>
          {DEMO_ACCOUNT_DATA.password}
        </Box>
      </Tooltip>
    </Typography>
  </Alert>
);
