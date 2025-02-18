import { Components, Theme } from '@mui/material/styles';

// ----------

export const getButtonOverwrites = (): Components<Theme> => ({
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
    styleOverrides: {},
  },
});
