'use client';

import { includes } from 'lodash';
import { DataType, EApplicationStatus, EPermission, EPermissionAction } from '@zpanel/core';
import { mixins } from 'gexii/theme';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { withLoadingEffect } from '@zpanel/ui/hoc';
import { Table, Cell } from 'gexii/table';
import { Button as MuiButton, Chip, Stack, Typography } from '@mui/material';

import { api } from 'src/service';
import { withPermissionRule } from 'src/guards';
import { Avatar, SimpleBar } from 'src/components';
import ReviewApplicationForm from 'src/forms/ReviewApplicationForm';

const Button = withLoadingEffect(MuiButton);

// ----------

interface ApplicationViewProps {
  applications: DataType.ApplicationDto[];
}

export default function ApplicationView({ applications }: ApplicationViewProps) {
  const dialogs = useDialogs();
  const snackbar = useSnackbar();
  const refresh = useRefresh();

  // --- FUNCTIONS ---

  const needsReview = (application: DataType.ApplicationDto) =>
    includes([EApplicationStatus.UNREVIEWED, EApplicationStatus.REAPPLIED], application.status);

  const canDelete = (application: DataType.ApplicationDto) =>
    includes([EApplicationStatus.APPROVED, EApplicationStatus.REJECTED], application.status);

  const completeWithToast = async (message: string) => {
    await refresh();
    snackbar.success(message);
  };

  // --- PROCEDURES ---

  const reviewApplication = useAction(async (application: DataType.ApplicationDto) => {
    dialogs.view(ReviewApplicationForm, 'Review Application', {
      application,
      onApprove: async () => completeWithToast('Application approved successfully'),
      onReject: async () => completeWithToast('Application rejected successfully'),
    });
  });

  const deleteApplication = useAction(async (application: DataType.ApplicationDto) => {
    await api.deleteApplication(application.id);
    await refresh();
    snackbar.success('Application deleted successfully');
  });

  // --- SECTION ELEMENTS ---

  const sections = {
    cells: {
      name: (
        <Cell
          label="Name"
          path="name"
          render={(name, application: DataType.ApplicationDto) => (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 250 }}>
              <Avatar />
              <Stack direction="column" spacing={0.5}>
                <Typography sx={mixins.ellipse()} color="textPrimary">
                  {name}
                </Typography>
                <Typography sx={mixins.ellipse()} color="textDisabled">
                  {application.email}
                </Typography>
              </Stack>
            </Stack>
          )}
        />
      ),
      introduction: (
        <Cell
          label="Introduction"
          path="introduction"
          render={(introduction) => (
            <Typography sx={[{ minWidth: 120 }, mixins.ellipse()]}>{introduction}</Typography>
          )}
        />
      ),
      status: (
        <Cell
          align="center"
          label="Status"
          path="status"
          render={(status: EApplicationStatus) => (
            <Chip {...statusMap[status]} variant="outlined" size="small" />
          )}
        />
      ),
      reviewer: (
        <Cell
          align="center"
          label="Reviewer"
          path="reviewer.name"
          render={(reviewer) => reviewer || '--'}
        />
      ),
      actions: (
        <Cell
          align="center"
          render={(item: DataType.ApplicationDto) => {
            if (needsReview(item))
              return (
                <ReviewButton size="small" onClick={() => reviewApplication.call(item)}>
                  Review
                </ReviewButton>
              );

            if (canDelete(item))
              return (
                <DeleteButton
                  color="error"
                  size="small"
                  onClick={() => deleteApplication.call(item)}
                >
                  Delete
                </DeleteButton>
              );
          }}
        />
      ),
    },
  };

  return (
    <SimpleBar sx={{ width: '100%' }}>
      <Table source={applications}>
        {sections.cells.name}
        {sections.cells.introduction}
        {sections.cells.status}
        {sections.cells.reviewer}
        {sections.cells.actions}
      </Table>
    </SimpleBar>
  );
}

// ----- RULED COMPONENTS -----

const ReviewButton = withPermissionRule(Button, EPermission.APPLICATION_CONFIGURE, {
  action: EPermissionAction.UPDATE,
});

const DeleteButton = withPermissionRule(Button, EPermission.APPLICATION_CONFIGURE, {
  action: EPermissionAction.DELETE,
});

// ----- CONSTANTS -----

const statusMap = {
  [EApplicationStatus.UNREVIEWED]: { label: 'Unreviewed', color: 'info' },
  [EApplicationStatus.REAPPLIED]: { label: 'Reapplied', color: 'info' },
  [EApplicationStatus.APPROVED]: { label: 'Approved', color: 'success' },
  [EApplicationStatus.REJECTED]: { label: 'Rejected', color: 'error' },
} as const;
