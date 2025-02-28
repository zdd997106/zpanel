'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDialogs } from 'gexii/dialogs';
import { useUpdateEffect } from 'gexii/hooks';
import {
  Box,
  Breadcrumbs,
  Button,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { useAction } from 'src/hooks';
import { mixins } from 'src/theme';
import Icons from 'src/icons';
import { SimpleBar } from 'src/components';
import PermissionForm from 'src/forms/PermissionForm';

// ----------

export default function PermissionView() {
  const dialogs = useDialogs();

  const formRef = useRef<HTMLFormElement>(null);
  const addItemRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});

  const {
    data: allPermissions = [],
    error: fetchedError,
    isFetched: isPermissionsReady,
    isFetching: isFetchingPermissions,
    refetch: refetchPermissions,
  } = useQuery({
    queryFn: () => api.getAllPermissions(),
    queryKey: [api.getAllPermissions.getPath()],
  });

  // --- FUNCTION ---

  const submit = () => formRef.current?.requestSubmit();

  const addItem = () => addItemRef.current();

  const alertError = (error: Error) => dialogs.alert('Error', error.message);

  const isLoading = () => isFetchingPermissions;

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    await refetchPermissions();

    await dialogs.alert('System Notification', 'Permissions have been updated successfully.', {
      maxWidth: 'xs',
    });
    resetRef.current();
  });

  // --- EFFECTS ---

  useUpdateEffect(() => {
    if (fetchedError) alertError(fetchedError);
  }, [fetchedError]);

  return (
    <>
      {isLoading() && (
        <LinearProgress
          color="primary"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: (theme) => theme.zIndex.appBar + 1,
          }}
        />
      )}

      <Breadcrumbs>
        <Link href={configs.routes.dashboard}>Dashboard</Link>
        <Typography>Configuration</Typography>
        <Typography>Permission</Typography>
      </Breadcrumbs>

      <Typography variant="h4">Permission Management</Typography>

      <Box position="relative" sx={[mixins.loading(isLoading())]}>
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
            {isPermissionsReady && (
              <PermissionForm
                ref={formRef}
                defaultValues={{ permissions: allPermissions }}
                addItemRef={addItemRef}
                resetRef={resetRef}
                onSubmit={handleSubmit.call}
                onSubmitError={alertError}
              />
            )}
          </SimpleBar>
        </Paper>
      </Box>
    </>
  );
}
