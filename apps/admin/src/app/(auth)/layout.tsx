import { SpaceLayout } from 'src/layouts';

// ----------

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <SpaceLayout>{children}</SpaceLayout>;
}
