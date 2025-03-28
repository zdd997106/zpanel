'use client';

import React, { useRef, useState } from 'react';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Collapse, Divider, Link, Stack, Typography } from '@mui/material';

import CONFIGS from 'src/configs';
import SignUpForm from 'src/forms/SignUpForm';

// ----------

export default function SignUpView() {
  const [error, setError] = useState<Error | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const dialogs = useDialogs();

  // --- FUNCTION ---

  const resetError = () => setError(null);

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    resetError();

    dialogs.alert(
      'Request Submitted',
      'Your request has been submitted successfully. You will receive an email to activate your account once it is approved. Thank you!',
      { okText: 'Got it', onClose: () => router.push(CONFIGS.routes.signIn) },
    );
  });

  return (
    <Stack direction="column" spacing={3}>
      <Box>
        <Typography variant="h3" component="h1">
          Request to get started
        </Typography>

        <Typography variant="caption">
          Already have an account?{' '}
          <Link href={CONFIGS.routes.signIn} color="primary">
            Sign In
          </Link>
        </Typography>
      </Box>

      <Collapse in={!handleSubmit.isLoading() && !!error} unmountOnExit>
        <Alert color="error" severity="error" sx={{ typography: 'caption' }}>
          {error?.message}
        </Alert>
      </Collapse>

      <SignUpForm ref={formRef} onSubmit={handleSubmit.call} onSubmitError={setError} />

      <Divider sx={{ border: 'none' }} />

      <Button
        size="large"
        loading={handleSubmit.isLoading()}
        onClick={() => formRef.current?.requestSubmit()}
      >
        Submit
      </Button>
    </Stack>
  );
}
