import { Container } from '@mui/material';
import { auth, AuthGuard } from 'src/guards';
import { api } from 'src/service';
import RoleListView from 'src/views/administration/RoleListView';

export default async function Page() {
  const roles = await auth(api.getAllRoles());
  const permissions = await auth(api.getAllPermissions());

  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <RoleListView roles={roles} permissions={permissions} />
    </Container>
  );
}
