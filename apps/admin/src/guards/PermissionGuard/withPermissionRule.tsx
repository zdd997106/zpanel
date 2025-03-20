import { EPermission, EPermissionAction } from '@zpanel/core';
import { createElement, forwardRef } from 'react';

import { usePermissionValidator } from './context';

// ----------

interface PermissionControlConfig {
  permission: EPermission;
  action?: EPermissionAction;
  behavior?: 'disappear' | 'disabled';
  OR?: Omit<PermissionControlConfig, 'OR' | 'behavior'>[];
}

export function withPermissionRule<TComponent extends React.ComponentType>(
  Component: TComponent,
  permission: EPermission,
  config: Omit<PermissionControlConfig, 'permission'> = {},
): TComponent {
  const { behavior = 'disappear', action = EPermissionAction.READ } = config;
  const rules = [{ ...config, permission }, ...(config.OR ?? [])].map((rule) => ({
    ...rule,
    action: rule.action ?? action,
  }));

  return forwardRef(function RuledComponent(props: Record<string, unknown>, ref) {
    const isValidPermission = usePermissionValidator();

    if (rules.some(isValidPermission)) return createElement(Component, { ...props, ref } as never);

    if (behavior === 'disabled')
      return createElement(Component, { ...props, ref, disabled: true } as never);

    return null;
  }) as unknown as TComponent;
}
