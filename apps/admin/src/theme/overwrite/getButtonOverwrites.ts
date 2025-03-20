import { Link } from '@mui/material';
import { Components, Theme } from '@mui/material/styles';

// ----------

export const getButtonOverwrites = (): Components<Theme> => ({
  MuiButton: {
    defaultProps: {
      variant: 'contained',
      LinkComponent: Link,
    },
    styleOverrides: {},
  },

  MuiIconButton: {
    defaultProps: {
      LinkComponent: Link,
    },
  },
});
