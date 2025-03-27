'use client';

import { z } from '@zpanel/core';
import { combineCallbacks } from 'gexii/utils';
import { get, has, isNil } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { cloneElement, createContext, useContext, useMemo } from 'react';

// ----- CONTEXT -----

const context = createContext<Record<string, unknown>>({} as never);

// ----------

export interface QueryFieldProps {
  query: string;
  children: React.ReactElement;
  behavior?: EBehavior;
}

export default function QueryField({
  query: key,
  children,
  behavior = EBehavior.PUSH,
}: QueryFieldProps) {
  const childrenProps = children.props as Record<string, unknown>;
  const value = useContext(context)[key] || '';
  const router = useRouter();

  // --- HANDLERS ---

  const getValue = getValueExtractor();
  const handleChange = (...args: unknown[]) => {
    const value = getValue(...args);

    const searchParams = new URLSearchParams(document.location.search);

    if (isNil(value) || value === '') searchParams.delete(key);
    else searchParams.set(key, String(value));

    router[behavior](searchParams.size ? `?${searchParams.toString()}` : '?');
  };

  return cloneElement(children, {
    ...childrenProps,
    ...{
      value: get(childrenProps, 'value') ?? value,
      onChange: combineCallbacks(handleChange, get(childrenProps, 'onChange') as never),
    },
  });
}

// ----- PROVIDER -----

export interface QueryFieldProviderProps {
  children: React.ReactNode;
  schema?: z.ZodTypeAny;
}

QueryField.Provider = function QueryFieldProvider({ children, schema }: QueryFieldProviderProps) {
  const searchParams = useSearchParams();

  const query = useMemo(() => {
    try {
      return schema?.parse(Object.fromEntries(searchParams.entries())) || {};
    } catch {
      return {};
    }
  }, [searchParams.toString()]);

  return <context.Provider value={query}>{children}</context.Provider>;
};

// ----- HELPERS -----

function getValueExtractor() {
  return (...args: unknown[]) => {
    // Return the target value if the first argument is an event with a target value
    if (args[0] && typeof args[0] === 'object' && has(args[0], 'target.value'))
      return get(args[0], 'target.value');

    // Return the target checked if the first argument is an event with a target checked
    if (args[0] && typeof args[0] === 'object' && has(args[0], 'target.checked'))
      return get(args[0], 'target.checked');

    // Return the second argument if it exists
    if (args.length === 2) return args[1];

    // Return the first argument if it exists
    return args[0];
  };
}

// ----- TYPES -----

const EBehavior = {
  REPLACE: 'replace',
  PUSH: 'push',
} as const;

type EBehavior = (typeof EBehavior)[keyof typeof EBehavior];
