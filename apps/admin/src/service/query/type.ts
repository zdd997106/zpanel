import { UseQueryOptions } from '@tanstack/react-query';

import * as api from '../api';

export type ApiQueryOptions<T extends keyof typeof api> = Omit<
  UseQueryOptions<Awaited<ReturnType<(typeof api)[T]>>>,
  'queryFn' | 'queryKey'
>;
