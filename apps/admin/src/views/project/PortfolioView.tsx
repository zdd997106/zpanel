'use client';

import { DataType } from '@zpanel/core';
import { useRef } from 'react';
import { useAction } from 'gexii/hooks';
import { useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { Button } from '@mui/material';

import { PageHeadButtonStack } from 'src/components';
import PortfolioForm from 'src/forms/PortfolioForm';

// ----------

export interface PortfolioViewProps {
  detail: DataType.PortfolioDto | null;
}

export default function PortfolioView({ detail }: PortfolioViewProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const refresh = useRefresh();
  const snackbar = useSnackbar();

  // --- FUNCTION ---

  const submit = () => formRef.current?.requestSubmit();

  const completeWithToast = async (message: string) => {
    await refresh();
    snackbar.success(message);
  };

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    await completeWithToast('Portfolio updated successfully');
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
      />
    </>
  );
}
