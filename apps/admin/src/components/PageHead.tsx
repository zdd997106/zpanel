import { Breadcrumbs, Link, Stack, StackProps, Typography } from '@mui/material';

interface PageHeadProps extends Omit<StackProps, 'title' | 'children'> {
  title: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHead({ title, breadcrumbs, ...props }: PageHeadProps) {
  return (
    <Stack {...props} direction="column" spacing={2}>
      <Typography variant="h4">{title}</Typography>

      <Breadcrumbs>
        {breadcrumbs.map(({ label, href }, index) =>
          href ? (
            <Link key={index} href={href}>
              {label}
            </Link>
          ) : (
            <Typography key={index}>{label}</Typography>
          ),
        )}
      </Breadcrumbs>
    </Stack>
  );
}
