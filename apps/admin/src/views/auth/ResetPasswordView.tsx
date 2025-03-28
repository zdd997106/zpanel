'use client';

import { FormDialog, useDialogs } from 'gexii/dialogs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import configs from 'src/configs';
import { api } from 'src/service';
import UpdatePasswordForm from 'src/forms/UpdatePasswordForm';

export default function ResetPasswordView() {
  const dialogs = useDialogs();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);

  const token = searchParams.get('token');

  // --- PROCEDURE ---

  const resetPassword = async () => {
    try {
      if (!token) return;

      const formDialog = dialogs.form(UpdatePasswordForm, 'Reset Password', {
        customUpdateAction: (value) => api.resetPassword({ ...value, token }),
        onSubmitError: async (error) => {
          dialogs.alert('Error', error.message, {
            onClose: () => formDialog.close(null),
          });
        },
      });

      await formDialog;
      if (!FormDialog.isCancelled(formDialog)) {
        await dialogs.alert(
          'Password reset successfully',
          'You can now sign in with your new password.',
          { okText: 'Got it' },
        );
      }
    } finally {
      router.push(configs.routes.signIn);
    }
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (!ready) return setReady(true);

    resetPassword();
  }, [ready]);

  return null;
}
