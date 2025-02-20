import type { Components, Theme } from '@mui/material/styles';
import * as mixins from '../mixins';

export const getAppBarOverwrites = (): Components<Theme> => ({
  MuiAppBar: {
    defaultProps: {
      color: 'transparent',
    },

    styleOverrides: {
      root: ({ theme }) => ({
        ...mixins.bgBlur({ color: theme.palette.background.default, blur: 6, opacity: 0.8 }),
        boxShadow: theme.shadows[0],
      }),
    },
  },
});
