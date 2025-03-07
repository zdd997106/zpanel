import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { DialogsProvider } from 'gexii/dialogs';

import { ThemeProvider } from 'src/theme';
import { ReadyMask } from 'src/components';

import { queryClient } from './client-values';

import './global.css';
import 'simplebar-react/dist/simplebar.min.css';

// ----------

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ZPanel</title>
      </head>

      <body>
        <QueryClientProvider client={queryClient}>
          <AppRouterCacheProvider>
            <ThemeProvider>
              <DialogsProvider>
                <ReadyMask>{children}</ReadyMask>
              </DialogsProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
