'use client';

import { EPermission, EPermissionAction } from '@zpanel/core';
import { createContext, useContext } from 'react';

// ----- CONTEXT ---

interface PermissionRule {
  permission?: EPermission;
  action?: EPermissionAction;
}

interface PermissionValidator {
  (permissionRule?: PermissionRule): boolean;
}

export const permissionValidatorContext = createContext<PermissionValidator>(null as never);

// ----- RELATED HOOKS -----

export const usePermissionValidator = () => {
  return useContext(permissionValidatorContext);
};

// ----- RELATED COMPONENTS -----

export const AuthProvider = permissionValidatorContext.Provider;
