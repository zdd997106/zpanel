'use client';

import { isEmpty, isString } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { Box, Collapse, Link, MenuList } from '@mui/material';

import { NavItemConfig } from 'src/configs';
import { usePathname } from 'next/navigation';
import { useUpdateEffect } from 'gexii/hooks';
import Icons, { findIcon } from 'src/icons';
import { Popover } from 'src/components';

import NavItem, { StyledListItem } from './NavItem';

// ----------

export interface NavListProps {
  items: NavItemConfig[];

  context?: {
    collapsed?: boolean;
  };
}

export default function NavList({ items, context = {} }: NavListProps) {
  const { collapsed: menuCollapsed } = context;
  const pathname = usePathname();

  // store the open state of each item
  const [record, setRecord] = useState<Record<string, boolean>>({});

  // --- FUNCTIONS ---

  const pathMatcher = getPathMatcher(pathname);

  const initialRecord = () => {
    if (menuCollapsed) return setRecord({});

    const entries = items.filter((item) => pathMatcher(item)).map((item) => [item.segment, true]);
    setRecord(Object.fromEntries(entries));
  };

  const canExpand = (
    item: NavItemConfig,
  ): item is NavItemConfig & Record<'children', NonNullable<NavItemConfig['children']>> => {
    return !isEmpty(item.children);
  };

  const toggleOpen = (item: NavItemConfig, value?: boolean) => {
    if (!canExpand(item)) return;
    setRecord((record) => ({ ...record, [item.segment]: value ?? !record[item.segment] }));
  };

  const isOpen = (item: NavItemConfig) => !!record[item.segment];

  // --- EFFECTS ---

  useUpdateEffect(() => {
    if (menuCollapsed) setRecord({});
  }, [menuCollapsed]);

  // initialize the open state of each item when pathname changes
  useEffect(initialRecord, [pathname]);

  return (
    <Box>
      {items.map((item, i) => {
        const path = `/${item.segment}`;
        const expandable = canExpand(item);
        const Icon = findIcon(item.icon, Icons.UndefinedSet);

        const sections = {
          navItem: (
            <Box component={!expandable ? Link : 'span'} href={path} underline="none">
              <NavItem
                variant={menuCollapsed ? 'icon' : 'normal'}
                icon={<Icon />}
                title={item.title}
                description={item.description}
                canExpand={expandable}
                selected={pathMatcher(item)}
                active={isOpen(item)}
                onClick={() => !menuCollapsed && toggleOpen(item)}
                onMouseLeave={() => menuCollapsed && toggleOpen(item, false)}
              />
            </Box>
          ),

          menuItems: item.children?.map((child) => {
            const childPath = [path, child.segment].filter(Boolean).join('/');
            const selected = pathMatcher(childPath, child.exact);
            return (
              <Link key={child.segment} href={childPath} underline="none" typography="body2">
                <StyledListItem active={selected} sx={{ marginBottom: 0.5 }}>
                  {child.title}
                </StyledListItem>
              </Link>
            );
          }),
        };

        // render the item with popover and collapse if item is expandable
        if (expandable)
          return (
            <Fragment key={i}>
              <Popover
                {...popoverConfigs}
                disabled={!menuCollapsed}
                slotProps={{ paper: { sx: { minWidth: 156 } } }}
                content={<MenuList sx={{ padding: 0.5 }}>{sections.menuItems}</MenuList>}
              >
                {sections.navItem}
              </Popover>

              <Collapse in={isOpen(item)}>
                <MenuList sx={{ paddingLeft: 3, marginTop: -1 }}>{sections.menuItems}</MenuList>
              </Collapse>
            </Fragment>
          );

        // render the item without them if it is not
        return <Fragment key={i}>{sections.navItem}</Fragment>;
      })}
    </Box>
  );
}

// ----- SETTINGS -----

const popoverConfigs = {
  variant: 'hover',
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'left',
  },
  spacingX: 1,
} as const;

// ----- HELPERS -----

function getPathMatcher(pathname: string) {
  type PathMatcher = {
    (target: string, exact?: boolean): boolean;
    (target: NavItemConfig, exact?: boolean): boolean;
  };

  const pathMatcher: PathMatcher = (target, exact) => {
    if (exact) return isString(target) ? pathname === target : pathname === `/${target.segment}`;
    if (isString(target)) return pathname.startsWith(target);
    if (!target.children) return pathname.startsWith(`/${target.segment}`);
    return target.children.some((child) =>
      pathname.startsWith(
        child.segment ? `/${target.segment}/${child.segment}` : `/${target.segment}`,
      ),
    );
  };

  return pathMatcher;
}
