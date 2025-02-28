'use client';

import React, { useRef, useState } from 'react';
import { useDialogs } from 'gexii/dialogs';
import { useRouter } from 'next/navigation';

import CONFIGS from 'src/configs';
import { useAction } from 'src/hooks';
import PermissionForm from 'src/forms/PermissionForm';

// ----------

export default function PermissionView() {
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

    await dialogs.alert(
      'Request Submitted',
      'Your request has been submitted successfully. You will receive an email to activate your account once it is approved. Thank you!',
      { okText: 'Got it' },
    );
    router.push(CONFIGS.routes.signIn);
  });

  return <PermissionForm ref={formRef} onSubmit={handleSubmit.call} onSubmitError={setError} />;
}
