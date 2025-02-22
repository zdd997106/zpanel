'use client';

import { useReady } from './useReady';

// ----------

export interface ReadyMaskProps extends React.PropsWithChildren {}

export default function ReadyMask({ children }: ReadyMaskProps) {
  const ready = useReady();

  return <div style={{ visibility: !ready ? 'hidden' : 'visible' }}>{children}</div>;
}
