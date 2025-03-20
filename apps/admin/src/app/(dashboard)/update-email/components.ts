'use client';

import { useEffect, useState } from 'react';
import { useDialogs } from 'gexii/dialogs';
import { useRouter } from 'next/navigation';
import configs from 'src/configs';

// ----------

export function CompletedWithDialog() {
  const dialogs = useDialogs();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // --- FUNCTIONS ---

  const showSuccessDialog = async () => {
    await dialogs.alert('Success', 'Your email has been updated successfully.');
    router.replace(configs.routes.account);
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (!ready) return setReady(true);
    showSuccessDialog();
  }, [ready]);

  return null;
}
