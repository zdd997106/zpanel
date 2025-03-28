import { Suspense } from 'react';

import ResetPasswordView from 'src/views/auth/ResetPasswordView';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordView />
    </Suspense>
  );
}
