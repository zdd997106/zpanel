import { EPermission, EPermissionAction } from '@zpanel/core';

import PermissionGuard from './PermissionGuard';

/**
 * Protects a component with a permission guard.
 */
export function withPermissionGuard<T extends React.ComponentType<any>>(
  Component: T,
  permission: EPermission,
  action?: EPermissionAction,
) {
  return (async (props) => (
    <PermissionGuard permission={permission} action={action}>
      <Component {...props} />
    </PermissionGuard>
  )) as T;
}
