'use client';

import { Button } from '@mui/material';
import { DataType } from '@zpanel/core';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { PageHeadButtonStack } from 'src/components';
import PortfolioForm from 'src/forms/PortfolioForm';

// ----------

export interface PortfolioViewProps {
  detail: DataType.PortfolioDto | null;
}

export default function PortfolioView({ detail }: PortfolioViewProps) {
  const dialogs = useDialogs();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // --- FUNCTION ---

  const submit = () => formRef.current?.requestSubmit();

  const alertError = (error: Error) => dialogs.alert('Error', error.message);

  const refetch = () => router.refresh();

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    await refetch();
  });

  return (
    <>
      <PageHeadButtonStack>
        <Button onClick={submit} loading={handleSubmit.isLoading()}>
          Submit Changes
        </Button>
      </PageHeadButtonStack>

      <PortfolioForm
        ref={formRef}
        defaultValues={detail || undefined}
        onSubmit={handleSubmit.call}
        onSubmitError={alertError}
      />
    </>
  );
}
