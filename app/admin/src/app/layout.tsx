'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'src/theme';
import { DialogsProvider } from 'gexii/dialogs';

import { ReadyMask } from 'src/components';

import { queryClient } from './query-client';

import './global.css';
import 'simplebar-react/dist/simplebar.min.css';

// ----------

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReadyMask>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <DialogsProvider>{children}</DialogsProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ReadyMask>
      </body>
    </html>
  );
}
