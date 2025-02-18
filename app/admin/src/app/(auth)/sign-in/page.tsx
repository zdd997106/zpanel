import { FloatingFrame } from 'src/components';
import SignInView from 'src/views/auth/SignInView';

// ----------

export default function Page() {
  return (
    <FloatingFrame>
      <SignInView />
    </FloatingFrame>
  );
}
