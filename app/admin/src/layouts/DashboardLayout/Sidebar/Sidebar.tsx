'use client';

import { isBoolean, noop } from 'lodash';
import { Fragment, useEffect, useImperativeHandle, useState } from 'react';
import { Collapse, Divider, List, Typography } from '@mui/material';

import CONFIGS from 'src/configs';
import { useResponsive } from 'src/hooks';
import { Logo, ScrollableBox } from 'src/components';

import { sidebarConfig } from '../configs';
import Drawer from './Drawer';
import NavSubHeader from './NavSubHeader';
import NavList from './NavList';

// ----------

export interface SidebarProps {
  toggleOpenRef?: React.Ref<() => void>;
}

export default function Sidebar({
  toggleOpenRef = { current: noop },
}: React.PropsWithChildren<SidebarProps>) {
  const [open, setOpen] = useState<boolean | null>(null);

  const smallDevice = useResponsive('down', 'md');
  const largeDevice = useResponsive('up', 'lg');
  const ready = useResponsive('up', 0);

  // --- FUNCTIONS ---

  const isExpand = () => {
    if (open !== null) return open;
    if (smallDevice) return false;
    return largeDevice;
  };

  const toggleOpen = (value?: boolean) => {
    if (isBoolean(value)) setOpen(value);
    setOpen((open) => !(open ?? isExpand()));
  };

  // --- EFFECTS ---

  useEffect(() => setOpen(null), [smallDevice]);

  // --- IMPERATIVE HANDLES ---

  useImperativeHandle(toggleOpenRef, () => toggleOpen);

  // --- ELEMENTS SECTIONS ---

  const sections = {
    logo: (
      <Typography
        variant="h4"
        component="div"
        height={sidebarConfig.logoHeight}
        fontSize={{ xs: sidebarConfig.logoHeight * 0.8 }}
      >
        <Logo expand={isExpand()} />
      </Typography>
    ),

    list: (
      <List sx={{ paddingX: 1 }}>
        {CONFIGS.nav.groups.map((group, index) => (
          <Fragment key={index}>
            <NavSubHeader title={group.title} hidden={!smallDevice && !isExpand()} />
            <NavList items={group.items} context={{ collapsed: !smallDevice && !isExpand() }} />
          </Fragment>
        ))}
      </List>
    ),
  };

  if (!ready) return null;

  return (
    <>
      {smallDevice && (
        <Drawer.MobileDrawer
          open={isExpand()}
          onOpen={() => toggleOpen(true)}
          onClose={() => toggleOpen(false)}
        >
          {sections.logo}

          <Divider sx={{ border: 'none', paddingTop: 2 }} />

          <ScrollableBox sx={{ flexGrow: 1 }}>{sections.list}</ScrollableBox>
        </Drawer.MobileDrawer>
      )}

      <Collapse in={!smallDevice} orientation="horizontal" unmountOnExit>
        <Drawer.PCDrawer open={isExpand()} onToggleOpen={toggleOpen}>
          {sections.logo}

          <Divider sx={{ border: 'none', paddingTop: 2 }} />

          <ScrollableBox sx={{ flexGrow: 1 }}>{sections.list}</ScrollableBox>
        </Drawer.PCDrawer>
      </Collapse>
    </>
  );
}
