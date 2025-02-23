import { Suspense } from 'react';

import { FloatingFrame } from 'src/components';
import SignUpView from 'src/views/auth/SignUpView';

// ----------

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FloatingFrame>
        <SignUpView />
      </FloatingFrame>
    </Suspense>
  );
}
