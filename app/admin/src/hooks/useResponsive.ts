import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, Breakpoint } from '@mui/material/styles';

type Query = 'up' | 'down' | 'between' | 'only';

/**
 *
 * Returns a responsive information through the specified query type
 *
 */
export function useResponsive(
  query: Query,
  start: Breakpoint | number,
  end?: Breakpoint | number,
): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints[query]?.(start as never, end as never));
}
