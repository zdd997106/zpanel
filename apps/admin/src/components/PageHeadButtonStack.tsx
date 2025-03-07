import { Stack, StackProps } from '@mui/material';

// ----------

interface PageHeadProps extends Omit<StackProps, 'direction'> {}

export default function PageHead({
  spacing = 1,
  justifyContent = 'end',
  marginBottom = { xs: 3, md: 6 },
  children,
  ...props
}: PageHeadProps) {
  return (
    <Stack
      {...props}
      direction="row"
      spacing={spacing}
      justifyContent={justifyContent}
      marginBottom={marginBottom}
    >
      {children}
    </Stack>
  );
}
