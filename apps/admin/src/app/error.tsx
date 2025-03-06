'use client';

import CommonPage from 'src/components/CommonPage';

// ----------

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  if (error.message === 'Unauthorized') {
    return <CommonPage.Forbidden fullScreen />;
  }

  return <CommonPage.Error fullScreen message={error.message} />;
}
