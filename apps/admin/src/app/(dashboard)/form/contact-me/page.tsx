import { FindContactMeFormSubmissionsDto } from '@zpanel/core';
import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import ContactMeSubmissionView from 'src/views/form/ContactMeSubmissionView';

// ----------

interface PageProps {
  searchParams: Promise<{}>;
}

async function Page({ searchParams }: PageProps) {
  const query = FindContactMeFormSubmissionsDto.schema.parse(await searchParams);
  const { items: submissions, count } = await auth(api.findAllContactMeSubmissions(query));

  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 3, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Form Submission' },
          { label: 'Contact Me' },
        ]}
        marginBottom={{ xs: 3 }}
      />

      <ContactMeSubmissionView
        submissions={submissions}
        paginationProps={{
          count: Math.ceil(count / query.limit),
          page: query.page,
        }}
      />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.CONTACT_ME_FORM);

export const metadata = {
  title: 'Management Contact Me Form Submission',
};

export const dynamic = 'force-dynamic';
