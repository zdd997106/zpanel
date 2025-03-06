'use client';

import { DataType } from '@zpanel/core';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { Box, Breadcrumbs, Button, Link, Paper, Stack, Typography } from '@mui/material';

import configs from 'src/configs';
import Icons from 'src/icons';
import { SimpleBar } from 'src/components';
import PermissionForm from 'src/forms/PermissionForm';

// ----------

interface PermissionViewProps {
  permissions: DataType.PermissionDto[];
}

export default function PermissionView({ permissions }: PermissionViewProps) {
  const dialogs = useDialogs();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const addItemRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});

  // --- FUNCTION ---

  const submit = () => formRef.current?.requestSubmit();

  const addItem = () => addItemRef.current();

  const alertError = (error: Error) => dialogs.alert('Error', error.message);

  const refetch = () => router.refresh();

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    await refetch();

    await dialogs.alert('System Notification', 'Permissions have been updated successfully.', {
      maxWidth: 'xs',
    });
    resetRef.current();
  });

  return (
    <>
      <Breadcrumbs>
        <Link href={configs.routes.dashboard}>Dashboard</Link>
        <Typography>Configuration</Typography>
        <Typography>Permission</Typography>
      </Breadcrumbs>

      <Typography variant="h4">Permission Management</Typography>

      <Box position="relative">
        <Stack direction="row" spacing={1} justifyContent="end" marginY={2}>
          <Button startIcon={<Icons.Add fontSize="small" />} size="small" onClick={addItem}>
            New Permission
          </Button>

          <Button
            variant="outlined"
            size="small"
            loading={handleSubmit.isLoading()}
            startIcon={<Icons.Save fontSize="small" />}
            onClick={submit}
          >
            Save
          </Button>
        </Stack>

        <Paper
          sx={{
            padding: { xs: 1, md: 2 },
            border: 'solid 1px',
            borderColor: 'divider',
            marginBottom: 3,
          }}
        >
          <SimpleBar
            sx={{
              height: '65dvh', // [TODO]: Use responsive height instead of fixed height
            }}
          >
            <PermissionForm
              ref={formRef}
              defaultValues={{ permissions }}
              addItemRef={addItemRef}
              resetRef={resetRef}
              onSubmit={handleSubmit.call}
              onSubmitError={alertError}
            />
          </SimpleBar>
        </Paper>
      </Box>
    </>
  );
}
