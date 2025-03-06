import { Container } from '@mui/material';
import { EPermission } from '@zpanel/core';

import { auth, PermissionGuard } from 'src/guards';
import { api } from 'src/service';
import ApplicationView from 'src/views/administration/ApplicationView';

async function Page() {
  const applications = await auth(api.getAllApplications());

  return (
    <Container>
      <ApplicationView applications={applications} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.APPLICATION_CONFIGURE);
