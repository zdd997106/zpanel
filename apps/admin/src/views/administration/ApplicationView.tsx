'use client';

import { includes } from 'lodash';
import { DataType, EApplicationStatus, EPermission, EPermissionAction } from '@zpanel/core';
import { useRouter } from 'next/navigation';
import { useDialogs, ViewDialog } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { api } from 'src/service';
import { mixins } from 'src/theme';
import { withPermissionRule } from 'src/guards';
import { Avatar, Cell, SimpleBar, Table } from 'src/components';
import ReviewApplicationForm from 'src/forms/ReviewApplicationForm';

// ----------

interface ApplicationViewProps {
  applications: DataType.ApplicationDto[];
}

export default function ApplicationView({ applications }: ApplicationViewProps) {
  const dialogs = useDialogs();
  const router = useRouter();

  // --- FUNCTIONS ---

  const needsReview = (application: DataType.ApplicationDto) =>
    includes([EApplicationStatus.UNREVIEWED, EApplicationStatus.REAPPLIED], application.status);

  const canDelete = (application: DataType.ApplicationDto) =>
    includes([EApplicationStatus.APPROVED, EApplicationStatus.REJECTED], application.status);

  const refetch = () => router.refresh();

  // --- PROCEDURES ---

  const reviewApplication = useAction(async (application: DataType.ApplicationDto) => {
    const dialog = dialogs.view(ReviewApplicationForm, 'Review Application', { application });
    if (await ViewDialog.isCancelled(dialog)) return;

    await refetch();
  });

  const deleteApplication = useAction(
    async (application: DataType.ApplicationDto) => {
      await api.deleteApplication(application.id);
      await refetch();
    },
    {
      onError: (error) => {
        dialogs.alert('Error', error.message, { color: 'error' });
      },
    },
  );

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

ApplicationView.metadata = {
  title: 'Application Management',
};

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
