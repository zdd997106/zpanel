import { Container } from '@mui/material';
import { EPermission } from '@zpanel/core';

import { PermissionGuard } from 'src/guards';

function Page() {
  return <Container>Hello, World!</Container>;
}

export default PermissionGuard.protect(Page, EPermission.FEEDBACK);
