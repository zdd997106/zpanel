import { Container } from '@mui/material';
import { AuthGuard } from 'src/guards';

export default function Page() {
  return (
    <AuthGuard>
      <Container>Hello, World!</Container>
    </AuthGuard>
  );
}
