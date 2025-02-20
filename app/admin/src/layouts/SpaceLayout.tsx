'use client';

import { alpha, useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import Stack from '@mui/material/Stack';

// ----------

export interface SpaceLayoutProps {
  children?: React.ReactNode;
}

function SpaceLayout({ children }: SpaceLayoutProps) {
  const theme = useTheme();

  return (
    <Stack
      component="main"
      alignItems="center"
      justifyContent="center"
      sx={(theme) => ({
        minHeight: '100dvh',
        padding: { xs: 0.5, sm: 2 },
        transition: theme.transitions.create(['padding'], {
          duration: theme.transitions.duration.short,
        }),
      })}
    >
      <GlobalStyles
        styles={() => ({
          'html body': {
            background: `linear-gradient(70deg, transparent, ${alpha(
              theme.palette.primary.light,
              0.4,
            )}, transparent), radial-gradient(transparent, ${alpha(
              theme.palette.secondary.dark,
              0.3,
            )})`,
          },
        })}
      />
      {children}
    </Stack>
  );
}

export default SpaceLayout;
