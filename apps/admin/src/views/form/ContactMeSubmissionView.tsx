'use client';

import {
  DataType,
  EPermission,
  EPermissionAction,
  FindContactMeFormSubmissionsDto,
} from '@zpanel/core';
import { isNaN, noop } from 'lodash';
import { useState } from 'react';
import { useAction } from 'gexii/hooks';
import { useDialogs } from 'gexii/dialogs';
import { useGeneralErrorHandler, useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { withDefaultProps, withLoadingEffect } from '@zpanel/ui/hoc';
import { Table, Cell } from 'gexii/table';
import { QueryField } from 'gexii/query-fields';
import {
  Box,
  MenuItem,
  Button as MuiButton,
  Pagination,
  PaginationProps,
  Stack,
  styled,
  Tab,
  Tabs,
  TabsProps,
  TextField,
  Tooltip,
} from '@mui/material';

import { api } from 'src/service';
import { withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { SearchField, SimpleBar } from 'src/components';
import ContactMeSubmissionDetail from 'src/features/ContactMeSubmissionDetail';

const Button = withLoadingEffect(MuiButton);

// ----------

interface ContactMeSubmissionViewProps {
  submissions: DataType.ContractMeForm.SubmissionDto[];
  paginationProps: PaginationProps;
}

export default function ContactMeSubmissionView({
  submissions,
  paginationProps,
}: ContactMeSubmissionViewProps) {
  const dialogs = useDialogs();
  const [searchBy, setFilterBy] = useState('email');
  const snackbar = useSnackbar();
  const refresh = useRefresh();

  // --- FUNCTIONS ---

  const completeWithToast = async (message: string) => {
    await refresh();
    snackbar.success(message);
  };

  // --- HANDLERS ---

  const handleError = useGeneralErrorHandler();

  // --- PROCEDURES ---

  const openSubmissionDetail = useAction(
    async (submission: DataType.ContractMeForm.SubmissionDto) => {
      const submissionDetail = await api.getContactMeSubmission(submission.id);
      dialogs.view(ContactMeSubmissionDetail, 'Submission', {
        data: submissionDetail,
      });
    },
    { onError: handleError },
  );

  const archiveSubmission = useAction(
    async (submission: DataType.ContractMeForm.SubmissionDto) => {
      await api.updateContactMeSubmission(submission.id, { archived: true });
      await completeWithToast('Submission archived');
    },
    { onError: handleError },
  );

  const unarchiveSubmission = useAction(
    async (submission: DataType.ContractMeForm.SubmissionDto) => {
      await api.updateContactMeSubmission(submission.id, { archived: false });
      await completeWithToast('Submission moved to inbox');
    },
    { onError: handleError },
  );

  const confirmToDeleteSubmission = useAction(
    async (submission: DataType.ContractMeForm.SubmissionDto) => {
      dialogs.confirm(
        'Warning',
        'Are you sure you want to delete this submission? This action cannot be undone. Consider archiving it instead if you want to keep it for future reference.',
        {
          color: 'error',
          okText: 'Delete',
          onOk: async () => deleteSubmission.call(submission),
        },
      );
    },
  );

  const deleteSubmission = useAction(
    async (submission: DataType.ContractMeForm.SubmissionDto) => {
      await api.deleteContactMeSubmission(submission.id);
      await completeWithToast('Submission deleted');
    },
    { onError: handleError },
  );

  // --- SECTION ELEMENTS ---

  const sections = {
    cells: {
      name: <Cell path="name" label="Name" ellipsis />,
      email: <Cell path="email" label="Email" ellipsis />,
      service: <Cell path="service" label="Service" ellipsis />,
      time: <Cell path="createdAt" label="Submitted At" render={renderDate} />,
      actions: (
        <Cell
          render={(_, item: DataType.ContractMeForm.SubmissionDto) => (
            <Stack direction="row" spacing={1} justifyContent="end">
              <ViewButton
                onClick={() => openSubmissionDetail.call(item)}
                startIcon={<Icons.Document fontSize="small" />}
              >
                View
              </ViewButton>

              {!item.archived ? (
                <UpdateButton
                  color="error"
                  onClick={() => archiveSubmission.call(item)}
                  startIcon={<Icons.Archive fontSize="small" />}
                >
                  Archive
                </UpdateButton>
              ) : (
                <UpdateButton
                  color="primary"
                  onClick={() => unarchiveSubmission.call(item)}
                  startIcon={<Icons.Unarchive fontSize="small" />}
                >
                  Unarchive
                </UpdateButton>
              )}

              <Tooltip title="Delete the record permanently">
                <DeleteButton
                  color="error"
                  onClick={() => confirmToDeleteSubmission.call(item)}
                  startIcon={<Icons.Remove fontSize="small" />}
                >
                  Delete
                </DeleteButton>
              </Tooltip>
            </Stack>
          )}
        />
      ),
    },

    archived: (
      <QueryField query="archived" childFields={['page', 'limit']}>
        <BooleanTabs>
          <Tab value="false" label="Inbox" icon={<Icons.Inbox />} iconPosition="start" />
          <Tab value="true" label="Archived" icon={<Icons.Archive />} iconPosition="start" />
        </BooleanTabs>
      </QueryField>
    ),

    search: (
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          select
          value={searchBy}
          label="Search By"
          sx={{ width: 150 }}
          onChange={(event) => setFilterBy(event.target.value)}
        >
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </TextField>

        <QueryField
          query={searchBy}
          defaultValue=""
          shouldForwardLoading={{ prop: 'disabled' }}
          childFields={['page', 'limit', 'email', 'name'].filter((field) => field !== searchBy)}
        >
          <SearchField fullWidth />
        </QueryField>
      </Stack>
    ),

    pagination: (
      <QueryField query="page" shouldForwardLoading={{ prop: 'disabled' }}>
        <Pagination {...paginationProps} />
      </QueryField>
    ),

    placeholder: (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        typography="body2"
        height="30vh"
      >
        No matched submission
      </Stack>
    ),
  };

  return (
    <QueryField.Provider schema={FindContactMeFormSubmissionsDto.schema}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        marginBottom={3}
        spacing={2}
      >
        <Box flexGrow={1}>{sections.search}</Box>

        {sections.archived}
      </Stack>

      <SimpleBar>
        <Table source={submissions} keyIndex="id" sx={{ minWidth: 500 }}>
          {sections.cells.time}
          {sections.cells.name}
          {sections.cells.email}
          {sections.cells.service}
          {sections.cells.actions}
        </Table>
      </SimpleBar>

      {paginationProps.count === 0 ? (
        sections.placeholder
      ) : (
        <Stack direction="row" justifyContent="end" marginTop={3}>
          {sections.pagination}
        </Stack>
      )}
    </QueryField.Provider>
  );
}

// ----- HELPERS -----

function renderDate(value: unknown) {
  if (!value) return '';

  const date = new Date(value as never);
  if (isNaN(date)) return 'Invalid Date';

  return (
    <Tooltip title={new Date(date).toLocaleString()}>
      <Box component="span">{new Date(date).toLocaleDateString()}</Box>
    </Tooltip>
  );
}

// ----- STYLED -----

const StyledRoleActionButton = styled(
  withDefaultProps(Button, {
    size: 'small',
    variant: 'outlined',
  }),
)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
}));

// ----- RULED COMPONENTS -----

const ViewButton = withPermissionRule(StyledRoleActionButton, EPermission.CONTACT_ME_FORM);

const UpdateButton = withPermissionRule(StyledRoleActionButton, EPermission.CONTACT_ME_FORM, {
  action: EPermissionAction.UPDATE,
});

const DeleteButton = withPermissionRule(StyledRoleActionButton, EPermission.CONTACT_ME_FORM, {
  action: EPermissionAction.DELETE,
});

// ----- INTERNAL COMPONENTS -----

// [NOTE]: This component is defined for solving a tricky definition of the Tabs component
// According to the value definition of the Tabs component:
// > If you don't want any selected Tab, you can set this prop to `false`
// So, we need to use string value instead of boolean to prevent the select state from being set to `false`
function BooleanTabs({ value, onChange = noop, ...props }: TabsProps) {
  return (
    <Tabs
      {...props}
      value={typeof value === 'boolean' ? String(value) : value}
      onChange={(event, value) => onChange(event, value === 'false' ? false : value === 'true')}
    >
      {props.children}
    </Tabs>
  );
}
