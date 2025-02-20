'use client';

import { useImperativeHandle } from 'react';
import { useToggle } from 'react-use';
import { useRouter } from 'next/navigation';
import { useDialogs } from 'gexii/dialogs';
import {
  Avatar,
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

import { ScrollableBox } from 'src/components';
import Icons, { createIcon } from 'src/icons';

import { useAction } from 'src/hooks';
import CONFIGS from 'src/configs';

import { profileDrawerConfig as profileConfig } from './configs';

// ----------

export interface ProfileDrawerProps {
  toggleOpenRef: React.Ref<() => void>;
}

export default function ProfileDrawer({ toggleOpenRef }: ProfileDrawerProps) {
  const [open, toggleOpen] = useToggle(false);
  const router = useRouter();
  const dialogs = useDialogs();

  const user = {
    name: 'Alexandra Johnson',
    email: 'alex.johnson@zpanel.com',
  };

  // --- PROCEDURE ---

  const logout = useAction(async () => {
    const yes = await dialogs.confirm('Notice', logoutWarning, { okText: 'Yes', color: 'error' });
    if (!yes) return;

    await router.push(CONFIGS.routes.signIn);
  });

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
            <Avatar sx={{ height: profileConfig.avatarSize, width: profileConfig.avatarSize }} />

            <Stack direction="column" textAlign="center">
              <Typography variant="h6" color="textPrimary">
                {user.name}
              </Typography>

              <Typography variant="subtitle2" color="textDisabled">
                {user.email}
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
            {profileConfig.shortcuts.map((shortcut, index) => (
              <Link key={index} href={shortcut.href} underline="none">
                <ListItemButton>
                  <ListItemIcon>{createIcon(shortcut.icon)}</ListItemIcon>
                  {shortcut.title}
                </ListItemButton>
              </Link>
            ))}
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
