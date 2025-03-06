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
