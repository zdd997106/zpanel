'use client';

import { DataType } from '@zpanel/core';
import { createElement, useEffect } from 'react';

import { ServiceEvent } from 'src/utils';
import { useRouter } from 'next/navigation';
import configs from 'src/configs';
import { AuthGuardContext } from './AuthGuardContext';

// ----------

export interface AuthGuardProviderProps {
  children?: React.ReactNode;
  value: DataType.AuthUserDto;
}

export const AuthGuardProvider = ({ children, value }: AuthGuardProviderProps) => {
  const router = useRouter();

  // --- EFFECTS ---

  useEffect(() => {
    return ServiceEvent.createRequestUnauthenticatedEvent().createListener(() => {
      const currentUrl = window.location.href.replace(window.location.host, '');
      router.push(`${configs.routes.signIn}?${new URLSearchParams({ url: currentUrl })}`);
    });
  }, []);

  return createElement(AuthGuardContext.Provider, { value }, children);
};
