'use client';

import { EPermission, EPermissionAction } from '@zpanel/core';
import { ServiceEvent } from '@zpanel/ui/service';
import { useCallback, useEffect, useMemo } from 'react';

import { query } from 'src/service';

import { permissionValidatorContext } from './context';

// ----------

interface PermissionProviderProvider {
  children?: React.ReactNode;
}

export default function PermissionProvider({ children }: PermissionProviderProvider) {
  const [permissionKeys, { refetch: refetchPermissionKeys }] = query.usePermissionKeys(false);

  const permissionActionMap = useMemo(
    () =>
      Object.fromEntries(
        permissionKeys.map((key) => {
          const [permission, action] = key.split(':');
          return [permission, parseInt(action, 16)];
        }),
      ) as PermissionActionMap,
    [permissionKeys],
  );

  // --- EFFECTS ---

  useEffect(() => {
    return ServiceEvent.createRequestForbiddenEvent().createListener(() => {
      refetchPermissionKeys();
    });
  }, []);

  return (
    <permissionValidatorContext.Provider
      value={useCallback(
        function validator({ permission, action = EPermissionAction.READ } = {}) {
          if (!permission) return true;

          if (
            permission in permissionActionMap &&
            // eslint-disable-next-line no-bitwise
            (action & permissionActionMap[permission]) === action
          )
            return true;

          return false;
        },
        [permissionActionMap],
      )}
    >
      {children}
    </permissionValidatorContext.Provider>
  );
}

// ----- RELATED TYPES -----

type PermissionActionMap = Record<EPermission, number>;
