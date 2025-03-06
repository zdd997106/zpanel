'use client';

import { useRef } from 'react';
import { Avatar, Badge, Box, Collapse, IconButton, Stack, styled } from '@mui/material';

import { useResponsive } from 'src/hooks';
import Icons from 'src/icons';
import { ScrollableBox } from 'src/components';

import { inRem } from 'src/utils';
import { ProfileDrawer } from '../components';
import Header from './Header';
import Sidebar from './Sidebar';
import { headerConfig } from './configs';

// ----------

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const toggleMenuRef = useRef<() => void>(null);
  const toggleProfileDrawerRef = useRef<() => void>(null);
  const smallDevice = useResponsive('down', 'md');

  // --- FUNCTIONS ---

  const toggleMenu = () => toggleMenuRef.current?.();

  const toggleProfileDrawer = () => toggleProfileDrawerRef.current?.();

  // --- ELEMENTS SECTIONS ---

  const sections = {
    menuIcon: (
      <Collapse in={smallDevice} orientation="horizontal" unmountOnExit>
        <IconButton onClick={() => toggleMenu()}>
          <Icons.Menu />
        </IconButton>
      </Collapse>
    ),

    headerIcons: (
      <Stack direction="row" marginLeft="auto" spacing={1} alignItems="center">
        <IconButton size="large">
          <Badge badgeContent={1} color="error">
            <Icons.Notifications />
          </Badge>
        </IconButton>

        <IconButton size="large">
          <Icons.Settings />
        </IconButton>

        <IconButton onClick={() => toggleProfileDrawer()}>
          <Avatar />
        </IconButton>
      </Stack>
    ),
  };

  return (
    <StyledRoot>
      <Sidebar toggleOpenRef={toggleMenuRef} />

      <ScrollableBox flexGrow={1}>
        <Stack direction="column" minHeight="100dvh">
          <Header>
            {sections.menuIcon}
            {sections.headerIcons}
          </Header>

          <Stack
            component="main"
            paddingBottom={inRem(headerConfig.height)}
            sx={{ position: 'relative', flexGrow: 1 }}
          >
            {children}
          </Stack>
        </Stack>
      </ScrollableBox>

      <ProfileDrawer toggleOpenRef={toggleProfileDrawerRef} />
    </StyledRoot>
  );
}

// ----- STYLED -----

const StyledRoot = styled(Box)(() => ({
  minHeight: '100dvh',
  width: '100dvw',
  display: 'flex',
}));
