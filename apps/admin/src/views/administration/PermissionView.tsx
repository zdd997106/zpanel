'use client';

import { DataType, EPermission, EPermissionAction } from '@zpanel/core';
import { useRef } from 'react';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { useRefresh } from '@zpanel/ui/hooks';
import { Button, Paper } from '@mui/material';

import { withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { PageHeadButtonStack, SimpleBar } from 'src/components';
import PermissionForm from 'src/forms/PermissionForm';

// ----------

interface PermissionViewProps {
  permissions: DataType.PermissionDto[];
}

export default function PermissionView({ permissions }: PermissionViewProps) {
  const dialogs = useDialogs();
  const refresh = useRefresh();

  const formRef = useRef<HTMLFormElement>(null);
  const addItemRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});

  // --- FUNCTION ---

  const submit = () => formRef.current?.requestSubmit();

  const addItem = () => addItemRef.current();

  const alertError = (error: Error) => dialogs.alert('Error', error.message);

  // --- HANDLERS ---

  const handleSubmit = useAction(async (submission: Promise<unknown>) => {
    await submission;
    await refresh();
    resetRef.current();

    dialogs.alert('System Notification', 'Permissions have been updated successfully.', {
      maxWidth: 'xs',
    });
  });

  return (
    <>
      <PageHeadButtonStack>
        <AddButton startIcon={<Icons.Add fontSize="small" />} size="small" onClick={addItem}>
          New Permission
        </AddButton>

        <UpdateButton
          variant="outlined"
          size="small"
          startIcon={<Icons.Save fontSize="small" />}
          onClick={submit}
        >
          Save
        </UpdateButton>
      </PageHeadButtonStack>

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
    </>
  );
}

// ----- RULED COMPONENTS -----

const AddButton = withPermissionRule(Button, EPermission.PERMISSION_CONFIGURE, {
  action: EPermissionAction.CREATE,
});

const UpdateButton = withPermissionRule(Button, EPermission.PERMISSION_CONFIGURE, {
  action: EPermissionAction.UPDATE,
  behavior: 'disabled',
});
