import type { Components, Theme } from '@mui/material/styles';

export const getAppBarOverwrites = (): Components<Theme> => ({
  MuiAppBar: {
    defaultProps: {
      color: 'transparent',
    },

    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: theme.shadows[0],
      }),
    },
  },
});
