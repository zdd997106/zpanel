import { Container } from '@mui/material';
import { PageHead } from 'src/components';
import configs from 'src/configs';

import { api } from 'src/service';
import PortfolioView from 'src/views/project/PortfolioView';

async function Page() {
  const portfolioDetail = await api.getPortfolioDetail();

  return (
    <Container>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Projects' },
          { label: 'Portfolio' },
        ]}
        marginBottom={{ xs: 3, md: -3.5 }}
      />

      <PortfolioView detail={portfolioDetail} />
    </Container>
  );
}

// export default PermissionGuard.protect(Page, EPermission.USER_CONFIGURE);
export default Page;

export const metadata = {
  title: 'Portfolio Management',
};

export const dynamic = 'force-dynamic';
