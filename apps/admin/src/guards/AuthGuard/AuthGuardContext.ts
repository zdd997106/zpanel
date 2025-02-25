'use client';

import { DataType } from '@zpanel/core';
import { createContext, useContext } from 'react';

// ----- CONTEXT ---

export const AuthGuardContext = createContext<DataType.AuthUserDetail>(null as never);

// ----- RELATED HOOKS -----

export const useAuth = () => {
  return useContext(AuthGuardContext);
};
