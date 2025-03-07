'use client';

import { EPermission, EPermissionAction } from '@zpanel/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { api } from 'src/service';
import { ServiceEvent } from 'src/utils';

import { permissionValidatorContext } from './context';

// ----------

interface PermissionProviderProvider {
  children?: React.ReactNode;
}

export default function PermissionProvider({ children }: PermissionProviderProvider) {
  // [NOTE]
  // The default permission keys is used for the case when the permission keys are not fetched yet.
  // To prevent the UI from flickering, the default permission keys are used until the actual permission keys are fetched.
  const [defaultPermissionKeys, setDefaultPermissionKeys] = useState([]);

  const { data: permissionKeys = defaultPermissionKeys, refetch: refetchPermissionKeys } = useQuery(
    {
      queryFn: () => api.getPermissionKeys(),
      queryKey: [api.getPermissionKeys.getPath()],
    },
  );

  const permissionsMap = useMemo(
    () =>
      Object.fromEntries(
        permissionKeys.map((key) => {
          const [permission, action] = key.split(':');
          return [permission, parseInt(action, 16)];
        }),
      ) as PermissionsMap,
    [permissionKeys],
  );

  // --- EFFECTS ---

  useEffect(() => {
    try {
      const storedPermissionString = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedPermissionString) return;

      setDefaultPermissionKeys(JSON.parse(storedPermissionString));
    } catch {
      // do nothing
    }
  }, []);

  useEffect(() => {
    if (permissionKeys.length > 0) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(permissionKeys));
    }
  }, [permissionKeys]);

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
            permission in permissionsMap &&
            // eslint-disable-next-line no-bitwise
            (action & permissionsMap[permission]) > 0
          )
            return true;

          return false;
        },
        [permissionsMap],
      )}
    >
      {children}
    </permissionValidatorContext.Provider>
  );
}

// ----- RELATED TYPES -----

type PermissionsMap = Record<EPermission, number>;

// ----- RELATED KEYS -----

const SESSION_STORAGE_KEY = 'permissionKeys';
