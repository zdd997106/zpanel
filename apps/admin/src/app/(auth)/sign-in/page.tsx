import { Suspense } from 'react';

import { FloatingFrame } from 'src/components';
import SignInView from 'src/views/auth/SignInView';

// ----------

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FloatingFrame>
        <SignInView />
      </FloatingFrame>
    </Suspense>
  );
}
