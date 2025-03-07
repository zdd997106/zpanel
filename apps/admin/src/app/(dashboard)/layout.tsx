import { AuthGuard } from 'src/guards';
import { PermissionProvider } from 'src/guards/PermissionGuard';
import { DashboardLayout } from 'src/layouts';

// ----------

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthGuard>
      <PermissionProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </PermissionProvider>
    </AuthGuard>
  );
}

// [NOTE]
// In case we need to verify user's authentication and permissions for the pages
// we set dynamic to `force-dynamic` to make sure the page is always dynamic and server-side rendered
export const dynamic = 'force-dynamic';
