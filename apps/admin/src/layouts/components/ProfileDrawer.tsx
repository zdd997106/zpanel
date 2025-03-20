'use client';

import { useImperativeHandle } from 'react';
import { useToggle } from 'react-use';
import { useRouter } from 'next/navigation';
import { useAction } from 'gexii/hooks';
import { useDialogs } from 'gexii/dialogs';
import {
  Button,
  Divider,
  IconButton,
  Link,
  ListItemButton,
  ListItemIcon,
  Stack,
  SwipeableDrawer,
  Typography,
} from '@mui/material';

import { Avatar, ScrollableBox } from 'src/components';
import Icons, { createIcon } from 'src/icons';

import CONFIGS from 'src/configs';

import { api } from 'src/service';
import { useAuth, usePermissionValidator } from 'src/guards';

import { createMedia } from 'src/utils';
import { EPermission } from '@zpanel/core';
import { profileDrawerConfig as profileConfig } from './configs';

// ----------

export interface ProfileDrawerProps {
  toggleOpenRef: React.Ref<() => void>;
}

export default function ProfileDrawer({ toggleOpenRef }: ProfileDrawerProps) {
  const [open, toggleOpen] = useToggle(false);
  const router = useRouter();
  const dialogs = useDialogs();
  const auth = useAuth();

  // --- FUNCTIONS ---

  const isValidPermission = usePermissionValidator();
  const canRead = (permission?: EPermission) => !permission || isValidPermission({ permission });

  const close = () => toggleOpen(false);

  // --- PROCEDURE ---

  const logout = useAction(
    async () => {
      const yes = await dialogs.confirm('Notice', logoutWarning, { okText: 'Yes', color: 'error' });
      if (!yes) return;

      await api.signOut();
      await router.push(CONFIGS.routes.signIn);
    },
    { onError: (error) => dialogs.alert('Error', error.message) },
  );

  // --- IMPERATIVE HANDLERS ---

  useImperativeHandle(toggleOpenRef, () => toggleOpen, [toggleOpen]);

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={() => toggleOpen(false)}
      onOpen={() => toggleOpen(true)}
    >
      <Stack direction="column" width={profileConfig.width} sx={{ flex: 1 }}>
        <ScrollableBox sx={{ flex: 1 }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ paddingTop: 8 }}
          >
            <Avatar
              src={auth.avatar ? createMedia.url(auth.avatar) : undefined}
              height={profileConfig.avatarSize}
              width={profileConfig.avatarSize}
            />

            <Stack direction="column" textAlign="center">
              <Typography variant="h6" color="textPrimary">
                {auth.name}
              </Typography>

              <Typography variant="subtitle2" color="textDisabled">
                {auth.email}
              </Typography>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ borderStyle: 'dashed', marginY: 3 }} />

          <Stack
            direction="column"
            spacing={0.5}
            paddingX={profileConfig.paddingX}
            sx={{ color: 'text.secondary' }}
          >
            {profileConfig.shortcuts.map(
              (shortcut, index) =>
                canRead(shortcut.permission) && (
                  <Link key={index} href={shortcut.href} underline="none" onClick={close}>
                    <ListItemButton>
                      <ListItemIcon>{createIcon(shortcut.icon)}</ListItemIcon>
                      {shortcut.title}
                    </ListItemButton>
                  </Link>
                ),
            )}
          </Stack>
        </ScrollableBox>
      </Stack>

      <Divider variant="fullWidth" sx={{ borderStyle: 'dashed', margin: 0 }} />

      <Stack direction="column" paddingX={profileConfig.paddingX} paddingY={3}>
        <Button
          color="error"
          variant="contained"
          fullWidth
          loading={logout.isLoading()}
          onClick={() => logout.call()}
        >
          Logout
        </Button>
      </Stack>

      <IconButton sx={{ position: 'absolute', top: 3, left: 3 }} onClick={() => toggleOpen()}>
        <Icons.Close />
      </IconButton>
    </SwipeableDrawer>
  );
}

// ----- WORDINGS -----

const logoutWarning = 'Are you sure you want to logout?';
