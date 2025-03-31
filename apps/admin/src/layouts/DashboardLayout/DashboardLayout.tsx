'use client';

import { EPermission } from '@zpanel/core';
import { createMedia, inRem } from '@zpanel/ui/utils';
import { useRef } from 'react';
import { useResponsive } from '@zpanel/ui/hooks';
import { Box, Collapse, IconButton, Stack, styled } from '@mui/material';

import configs from 'src/configs';
import { useAuth, withPermissionRule } from 'src/guards';
import Icons from 'src/icons';
import { Avatar, ScrollableBox } from 'src/components';
import { NotificationButton, ProfileDrawer } from 'src/features';

import Header from './Header';
import Sidebar from './Sidebar';
import { headerConfig } from './configs';

const ViewNotificationButton = withPermissionRule(NotificationButton, EPermission.NOTIFICATION);

// ----------

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const auth = useAuth();
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
        <ViewNotificationButton size="large">
          <Icons.Notifications />
        </ViewNotificationButton>

        <IconButton size="large" href={configs.routes.account}>
          <Icons.Settings />
        </IconButton>

        <IconButton onClick={() => toggleProfileDrawer()}>
          <Avatar src={auth.avatar ? createMedia.url(auth.avatar) : undefined} />
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
