'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useRef } from 'react';

export function useQueryParams<T extends Record<string, string>>() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryParams = useMemo(
    () => Object.fromEntries(searchParams.entries()) as T,
    [searchParams],
  );
  const queryParamsRef = useRef(queryParams);
  queryParamsRef.current = queryParams;

  // --- FUNCTIONS ---

  const replace = (value: Partial<T>) => {
    router.replace(`${pathname}?${new URLSearchParams({ ...queryParamsRef.current, ...value })}`);
  };

  const push = (value: Partial<T>) => {
    router.push(`${pathname}?${new URLSearchParams({ ...queryParamsRef.current, ...value })}`);
  };

  return [queryParams, useMemo(() => ({ replace, push }), [])] as const;
}
