import { redirect } from 'next/navigation';

import configs from 'src/configs';
import { AuthGuard } from 'src/guards';

// ----------

export default function Page() {
  return (
    <AuthGuard>
      <Redirect />
    </AuthGuard>
  );
}

function Redirect() {
  return redirect(configs.routes.dashboard);
}
