'use client';

import { EPermission, EPermissionAction } from '@zpanel/core';
import CommonPage from 'src/components/CommonPage';

import { usePermissionValidator } from './context';

// ----------

export interface PermissionGuardProps {
  children?: React.ReactNode;
  permission: EPermission;
  action?: EPermissionAction;
}

export default function PermissionGuard({ children, permission, action }: PermissionGuardProps) {
  const isValidPermission = usePermissionValidator();

  if (isValidPermission({ permission, action })) return children;
  return <CommonPage.Forbidden />;
}
