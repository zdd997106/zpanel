import { FloatingFrame } from 'src/components';
import SignUpView from 'src/views/auth/SignUpView';

// ----------

export default function Page() {
  return (
    <FloatingFrame>
      <SignUpView />
    </FloatingFrame>
  );
}
