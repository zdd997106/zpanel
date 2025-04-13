'use client';

import { DataType } from '@zpanel/core';
import { useRef } from 'react';
import { useAction } from 'gexii/hooks';
import { useDialogs } from 'gexii/dialogs';
import { useRefresh, useSnackbar } from '@zpanel/ui/hooks';
import { withLoadingEffect } from '@zpanel/ui/hoc';
import { Button as PureButton, Stack, styled, Card, Typography, Divider } from '@mui/material';

import UpdatePasswordForm from 'src/forms/UpdatePasswordForm';
import PersonalInformationForm from 'src/forms/PersonalInformationForm';
import UpdateEmailForm from 'src/forms/UpdateEmailForm';

const Button = withLoadingEffect(PureButton);

// ----------

interface AccountViewProps {
  user: DataType.UserDetailDto;
}

export default function AccountView({ user }: AccountViewProps) {
  const refresh = useRefresh();
  const snackbar = useSnackbar();
  const dialogs = useDialogs();

  const formRefs = {
    personalInformation: useRef<HTMLFormElement>(null),
    changePassword: useRef<HTMLFormElement>(null),
    changeEmail: useRef<HTMLFormElement>(null),
  };

  const actionRefs = {
    resetPersonalInformation: useRef<VoidFunction>(() => {}),
  };

  // --- FUNCTIONS ---

  const submitPersonalInformation = () => formRefs.personalInformation.current?.requestSubmit();

  const resetPersonalInformation = () => actionRefs.resetPersonalInformation.current();

  const submitChangePassword = () => formRefs.changePassword.current?.requestSubmit();

  const submitChangeEmail = () => formRefs.changeEmail.current?.requestSubmit();

  // --- HANDLERS ---

  const handleSubmitPersonalInformation = useAction(async (submission: Promise<unknown>) => {
    await submission;
    await refresh();
    snackbar.success('Personal information updated successfully');
  });

  const handleSubmitChangePassword = useAction(async (submission: Promise<unknown>) => {
    await submission;
    snackbar.success('Password updated successfully');
  });

  const handleSubmitChangeEmail = useAction(async (submission: Promise<unknown>) => {
    await submission;
    dialogs.alert(
      'Confirmation Email Sent',
      'A confirmation email has been sent to your new email address. Please check your inbox and follow the instructions to complete the update.',
    );
  });

  // --- SECTION ELEMENTS ---

  const sections = {
    personalInformation: {
      intro: (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Update your personal information to let others know more about you
          </Typography>
        </>
      ),
      form: (
        <PersonalInformationForm
          ref={formRefs.personalInformation}
          id={user.id}
          email={user.email || ''}
          defaultValues={user}
          resetRef={actionRefs.resetPersonalInformation}
          onSubmit={handleSubmitPersonalInformation.call}
        />
      ),
      actions: (
        <Stack direction="row" spacing={2}>
          <Button onClick={resetPersonalInformation} variant="outlined">
            Discard
          </Button>
          <Button
            loading={handleSubmitPersonalInformation.isLoading()}
            onClick={submitPersonalInformation}
          >
            Apply Changes
          </Button>
        </Stack>
      ),
    },

    changePassword: {
      intro: (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Change Password
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Update your password associated with this account
          </Typography>
        </>
      ),
      form: (
        <UpdatePasswordForm
          ref={formRefs.changePassword}
          onSubmit={handleSubmitChangePassword.call}
        />
      ),
      actions: (
        <Stack direction="row" spacing={2}>
          <Button loading={handleSubmitChangePassword.isLoading()} onClick={submitChangePassword}>
            Update Change
          </Button>
        </Stack>
      ),
    },

    changeEmail: {
      intro: (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Change Email
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Send a confirmation email to update your email address
          </Typography>
        </>
      ),
      form: (
        <UpdateEmailForm
          ref={formRefs.changeEmail}
          id={user.id}
          onSubmit={handleSubmitChangeEmail.call}
        />
      ),
      actions: (
        <Stack direction="row" spacing={2}>
          <Button loading={handleSubmitChangeEmail.isLoading()} onClick={submitChangeEmail}>
            Send Confirmation Email
          </Button>
        </Stack>
      ),
    },
  };

  return (
    <>
      <Stack component={StyledCard} direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack sx={{ width: { xs: '100%', md: 250 } }}>{sections.personalInformation.intro}</Stack>

        <Stack flexGrow={1} spacing={3}>
          {sections.personalInformation.form}
          {sections.personalInformation.actions}
        </Stack>
      </Stack>

      <Divider sx={{ border: 'none', marginTop: 5 }} />

      <Stack component={StyledCard} direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack sx={{ width: { xs: '100%', md: 250 } }}>{sections.changePassword.intro}</Stack>

        <Stack flexGrow={1} spacing={3}>
          {sections.changePassword.form}
          {sections.changePassword.actions}
        </Stack>
      </Stack>

      <Divider sx={{ border: 'none', marginTop: 5 }} />

      <Stack component={StyledCard} direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack sx={{ width: { xs: '100%', md: 250 } }}>{sections.changeEmail.intro}</Stack>

        <Stack flexGrow={1} spacing={3}>
          {sections.changeEmail.form}
          {sections.changeEmail.actions}
        </Stack>
      </Stack>
    </>
  );
}

// ----- STYLED -----

const StyledCard = styled(Card)(({ theme }) => ({
  padding: [theme.spacing(5), theme.spacing(3)].join(' '),
  flexGrow: 1,
  flexBasis: 1,
  border: 'solid 1px',
  borderColor: theme.palette.divider,
}));
