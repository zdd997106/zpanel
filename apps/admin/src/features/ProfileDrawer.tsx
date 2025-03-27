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

import { api } from 'src/service';
import configs from 'src/configs';
import { useAuth, usePermissionValidator } from 'src/guards';
import Icons, { createIcon } from 'src/icons';
import { Avatar, ScrollableBox } from 'src/components';

import { createMedia } from 'src/utils';
import { EPermission } from '@zpanel/core';

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
      await router.push(configs.routes.signIn);
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
      <Stack direction="column" width={settings.width} sx={{ flex: 1 }}>
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
              height={settings.avatarSize}
              width={settings.avatarSize}
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
            spacing={1}
            paddingX={settings.paddingX}
            sx={{ color: 'text.secondary' }}
          >
            {settings.shortcuts.map(
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

      <Stack direction="column" paddingX={settings.paddingX} paddingY={3}>
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

// ----- SETTINGS -----

const settings = {
  width: 320,

  avatarSize: 120,

  paddingX: 2.5,

  shortcuts: [
    {
      icon: 'Settings',
      title: 'Account Settings',
      href: configs.routes.account,
      permission: EPermission.ACCOUNT,
    },
    {
      icon: 'Key',
      title: 'User App Key',
      href: configs.routes.userApiKey,
      permission: EPermission.APP_KEY_MANAGEMENT,
    },
    {
      icon: 'Notifications',
      title: 'My Notifications',
      href: configs.routes.notification,
      permission: EPermission.NOTIFICATION,
    },
  ],
};
