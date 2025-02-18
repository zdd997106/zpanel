'use client';

import React, { useRef, useState } from 'react';
import { Alert, Box, Button, Collapse, Divider, Link, Stack, Typography } from '@mui/material';

import { ROUTES } from 'src/configs';
import { useAction } from 'src/hooks';
import SignUpForm from 'src/forms/SignUpForm';
import { useRouter } from 'next/navigation';

// ----------

export default function SignUpView() {
  const [error, setError] = useState<Error | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // --- HANDLERS ---

  const handleSubmit = useAction(
    async (submission: Promise<unknown>) => {
      await submission;
    },
    { onSuccess: () => router.push(ROUTES.SIGN_IN) },
  );

  return (
    <Stack direction="column" spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">
          Request to get started
        </Typography>

        <Typography variant="caption">
          Already have an account?{' '}
          <Link href={ROUTES.SIGN_IN} color="primary">
            Sign In
          </Link>
        </Typography>
      </Box>

      <Collapse in={!handleSubmit.isLoading() && !!error} unmountOnExit>
        <Alert color="error" severity="error">
          <Typography variant="caption">{error?.message}</Typography>
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
