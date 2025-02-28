'use client';

import { DataType } from '@zpanel/core';
import { createContext, useContext } from 'react';

// ----- CONTEXT ---

export const AuthGuardContext = createContext<DataType.AuthUserDto>(null as never);

// ----- RELATED HOOKS -----

export const useAuth = () => {
  return useContext(AuthGuardContext);
};
