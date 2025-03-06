'use client';

import { GlobalStyles } from '@mui/material';
import { useReady } from './useReady';

// ----------

export interface ReadyMaskProps extends React.PropsWithChildren {}

export default function ReadyMask({ children }: ReadyMaskProps) {
  const ready = useReady();

  return (
    <>
      <GlobalStyles styles={{ body: { visibility: !ready ? 'hidden' : 'visible' } }} />
      {children}
    </>
  );
}
