import { Container } from '@mui/material';
import { auth } from 'src/guards';
import { api } from 'src/service';
import ApplicationView from 'src/views/administration/ApplicationView';

export default async function Page() {
  const applications = await auth(api.getAllApplications());

  return (
    <Container>
      <ApplicationView applications={applications} />
    </Container>
  );
}
