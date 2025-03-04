'use client';

import { includes } from 'lodash';
import { DataType, EApplicationStatus } from '@zpanel/core';
import { useQuery } from '@tanstack/react-query';
import { useDialogs } from 'gexii/dialogs';
import { useAction } from 'gexii/hooks';
import { Box, Breadcrumbs, Button, Chip, Link, Typography } from '@mui/material';

import configs from 'src/configs';
import { api } from 'src/service';
import { mixins } from 'src/theme';
import { Cell, SimpleBar, Table } from 'src/components';
import ReviewApplicationForm from 'src/forms/ReviewApplicationForm';

// ----------

export default function ApplicationView() {
  const dialogs = useDialogs();

  const { data: applications = [], refetch: refetchApplications } = useQuery({
    queryKey: [api.getAllApplications.getPath()],
    queryFn: () => api.getAllApplications(),
  });

  // --- FUNCTIONS ---

  const needsReview = (application: DataType.ApplicationDto) =>
    includes([EApplicationStatus.UNREVIEWED, EApplicationStatus.REAPPLIED], application.status);

  const canDelete = (application: DataType.ApplicationDto) =>
    includes([EApplicationStatus.APPROVED, EApplicationStatus.REJECTED], application.status);

  // --- PROCEDURES ---

  const reviewApplication = useAction(async (application: DataType.ApplicationDto) => {
    await dialogs.view(ReviewApplicationForm, 'Review Application', { application });
    await refetchApplications();
  });

  const deleteApplication = useAction(
    async (application: DataType.ApplicationDto) => {
      await api.deleteApplication(application.id);
      await refetchApplications();
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
          render={(name) => (
            <Typography sx={[{ minWidth: 100 }, mixins.ellipse()]}>{name}</Typography>
          )}
        />
      ),
      email: (
        <Cell
          label="Email"
          path="email"
          render={(name) => (
            <Typography sx={[{ minWidth: 120 }, mixins.ellipse()]}>{name}</Typography>
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
                <Button size="small" onClick={() => reviewApplication.call(item)}>
                  Review
                </Button>
              );

            if (canDelete(item))
              return (
                <Button color="error" size="small" onClick={() => deleteApplication.call(item)}>
                  Delete
                </Button>
              );
          }}
        />
      ),
    },
  };

  return (
    <>
      <Breadcrumbs>
        <Link href={configs.routes.dashboard}>Dashboard</Link>
        <Link href={configs.routes.userManagement}>User</Link>
        <Typography>Application</Typography>
      </Breadcrumbs>

      <Typography variant="h4">Application Management</Typography>

      <Box paddingTop={3} />

      <SimpleBar sx={{ width: '100%' }}>
        <Table source={applications}>
          {sections.cells.name}
          {sections.cells.email}
          {sections.cells.introduction}
          {sections.cells.status}
          {sections.cells.reviewer}
          {sections.cells.actions}
        </Table>
      </SimpleBar>
    </>
  );
}

const statusMap = {
  [EApplicationStatus.UNREVIEWED]: { label: 'Unreviewed', color: 'info' },
  [EApplicationStatus.REAPPLIED]: { label: 'Reapplied', color: 'info' },
  [EApplicationStatus.APPROVED]: { label: 'Approved', color: 'success' },
  [EApplicationStatus.REJECTED]: { label: 'Rejected', color: 'error' },
} as const;
