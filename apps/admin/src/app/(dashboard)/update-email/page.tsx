import CommonPage from 'src/components/CommonPage';
import { api } from 'src/service';

import { CompletedWithDialog } from './components';

interface PageProps {
  searchParams: Promise<{ user: string; token: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { user, token } = await searchParams;

  try {
    if (!user || !token) throw new Error();
    await api.updateUserEmail(user, { token });
  } catch {
    return (
      <CommonPage.Forbidden
        message={
          'The email update request is invalid or has expired. ' +
          'Please request a new email update.'
        }
      />
    );
  }

  return <CompletedWithDialog />;
}
