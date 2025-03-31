import { redirect } from 'next/navigation';

import configs from 'src/configs';

// ----------

export default function Page() {
  return <Redirect />;
}

function Redirect() {
  return redirect(configs.routes.dashboard);
}
