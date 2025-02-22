import type { Components, Theme } from '@mui/material/styles';
import Link from 'next/link';

// ----------

export const getLinkOverwrites = (): Components<Theme> => ({
  MuiLink: {
    defaultProps: {
      component: Link,
      color: 'text.primary',
      underline: 'hover',
    },
  },
});
