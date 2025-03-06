'use client';

import CommonPage from 'src/components/CommonPage';

// ----------

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  if (error.message === 'Unauthorized') {
    return <CommonPage.Forbidden />;
  }

  return <CommonPage.Error message={error.message} />;
}
