'use client';

import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeOptions, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { typography } from './typography';
import { palette } from './palette';
import { shadows } from './shadows';
import { overwrites } from './overwrite';

// ----------

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      shape: { borderRadius: 8 },
      typography,
      components: overwrites,
    }),
    [],
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
