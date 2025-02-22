'use client';

import { AppBar, Box, Toolbar } from '@mui/material';

import { headerConfig } from './configs';

// ----------

export interface HeaderProps {
  children?: React.ReactNode;
  position?: EPosition;
}

export default function Header({ children, position = EPosition.STICKY }: HeaderProps) {
  return (
    <>
      <AppBar position={position}>
        <Toolbar
          sx={{
            height: headerConfig.height,
            paddingX: { xs: 1, md: 5 },
            transition: (theme) => theme.transitions.create('padding'),
          }}
        >
          {children}
        </Toolbar>
      </AppBar>

      {position === EPosition.FIXED && <Box height={headerConfig.height} />}
    </>
  );
}

// ----- TYPES -----

const EPosition = {
  FIXED: 'fixed',
  STICKY: 'sticky',
} as const;

type EPosition = (typeof EPosition)[keyof typeof EPosition];
