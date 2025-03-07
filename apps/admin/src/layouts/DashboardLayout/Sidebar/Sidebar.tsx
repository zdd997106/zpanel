'use client';

import { isBoolean, noop } from 'lodash';
import { EPermissionAction } from '@zpanel/core';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Collapse, Divider, List, Typography } from '@mui/material';

import configs, { NavGroupConfig, NavItemConfig } from 'src/configs';
import { useResponsive } from 'src/hooks';
import { usePermissionValidator } from 'src/guards';
import { Logo, ScrollableBox } from 'src/components';

import { sidebarConfig } from '../configs';
import Drawer from './Drawer';
import NavSubHeader from './NavSubHeader';
import NavList from './NavList';
import { filterByPermits } from './helpers';

// ----------

export interface SidebarProps {
  toggleOpenRef?: React.Ref<() => void>;
}

export default function Sidebar({
  toggleOpenRef = { current: noop },
}: React.PropsWithChildren<SidebarProps>) {
  const [open, setOpen] = useState<boolean | null>(null);
  const navGroups = useNavGroups();
  const pathname = usePathname();

  const smallDevice = useResponsive('down', 'md');
  const largeDevice = useResponsive('up', 'lg');
  const ready = useResponsive('up', 0);

  // --- FUNCTIONS ---

  // [NOTE] the default value of open is null, which means the open state is controlled by the device size
  const isExpand = () => {
    if (open !== null) return open;
    if (smallDevice) return false;
    return largeDevice;
  };

  const toggleOpen = (value?: boolean) => {
    if (isBoolean(value)) setOpen(value);
    else setOpen((open) => !(open ?? isExpand()));
  };

  // --- EFFECTS ---

  // close the sidebar when pathname changes or device type changes
  useEffect(() => setOpen(null), [smallDevice, pathname]);

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
        {navGroups.map((group, index) => (
          <Fragment key={index}>
            <NavSubHeader title={group.title} hidden={!smallDevice && !isExpand()} />
            <NavList items={group.items} context={{ collapsed: !smallDevice && !isExpand() }} />
          </Fragment>
        ))}
      </List>
    ),

    divider: <Divider sx={{ border: 'none', paddingTop: 2 }} />,
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
          {sections.divider}
          <ScrollableBox sx={{ flexGrow: 1 }}>{sections.list}</ScrollableBox>
        </Drawer.MobileDrawer>
      )}

      <Collapse in={!smallDevice} orientation="horizontal" unmountOnExit>
        <Drawer.PCDrawer open={isExpand()} onToggleOpen={toggleOpen}>
          {sections.logo}
          {sections.divider}
          <ScrollableBox sx={{ flexGrow: 1 }}>{sections.list}</ScrollableBox>
        </Drawer.PCDrawer>
      </Collapse>
    </>
  );
}

// ----- INTERNAL HOOKS -----

function useNavGroups(): NavGroupConfig[] {
  const permit = usePermissionValidator();

  return useMemo(() => {
    const canRead = (item: NavItemConfig) =>
      permit({ permission: item.permission, action: EPermissionAction.READ });

    return filterByPermits(configs.nav.groups, canRead);
  }, [permit]);
}
