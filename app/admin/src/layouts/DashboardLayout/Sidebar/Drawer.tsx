'use client';

import {
  Box,
  Drawer,
  DrawerProps,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
} from '@mui/material';

import { sidebarConfig } from '../configs';
import CollapseButton from './CollapseButton';

// ----------

export default {
  MobileDrawer,
  PCDrawer,
};

// ----- INTERNAL COMPONENTS -----

export interface MobileDrawerProps extends SwipeableDrawerProps {}

function MobileDrawer({ children, ...props }: MobileDrawerProps) {
  return (
    <SwipeableDrawer
      {...props}
      PaperProps={{ sx: { width: sidebarConfig.openedWidth, alignItems: 'center' } }}
    >
      <Stack direction="column" sx={{ width: '100%', height: '100%' }}>
        {children}
      </Stack>
    </SwipeableDrawer>
  );
}

export interface PCDrawerProps extends DrawerProps {
  onToggleOpen?: () => void;
}

function PCDrawer({ open = false, children, onToggleOpen, ...props }: PCDrawerProps) {
  return (
    <Box position="sticky" top={0} height="100dvh" zIndex={(theme) => theme.zIndex.drawer}>
      <Drawer
        {...props}
        variant="permanent"
        PaperProps={{
          ...props.PaperProps,
          sx: [
            props.PaperProps?.sx as never,
            {
              position: 'relative',
              height: '100vh',
              minWidth: sidebarConfig.closedWidth,
              width: open ? sidebarConfig.openedWidth : sidebarConfig.closedWidth,
              transition: (theme) => theme.transitions.create('width'),
            },
          ],
        }}
      >
        {children}
      </Drawer>

      <CollapseButton
        open={open}
        top={sidebarConfig.logoHeight / 2}
        left="100%"
        zIndex={(theme) => theme.zIndex.drawer + 1}
        toggleOpen={onToggleOpen}
      />
    </Box>
  );
}
