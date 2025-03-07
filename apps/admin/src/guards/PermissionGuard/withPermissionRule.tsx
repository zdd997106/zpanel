import { EPermission, EPermissionAction } from '@zpanel/core';
import { createElement, forwardRef } from 'react';

import { usePermissionValidator } from './context';

// ----------

interface PermissionControlConfig {
  action?: EPermissionAction;
  behavior?: 'disappear' | 'disabled';
}

export function withPermissionRule<TComponent extends React.ComponentType>(
  Component: TComponent,
  permission: EPermission,
  config: PermissionControlConfig = {},
): TComponent {
  const { action = EPermissionAction.READ, behavior = 'disappear' } = config;

  return forwardRef(function RuledComponent(props: Record<string, unknown>, ref) {
    const isValidPermission = usePermissionValidator();

    if (isValidPermission({ permission, action }))
      return createElement(Component, { ...props, ref } as never);

    if (behavior === 'disabled')
      return createElement(Component, { ...props, ref, disabled: true } as never);

    return null;
  }) as unknown as TComponent;
}
