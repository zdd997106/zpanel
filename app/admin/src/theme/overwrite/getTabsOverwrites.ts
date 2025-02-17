import { Components, Theme } from '@mui/material/styles';

// ----------

export const getTabsOverwrites = (): Components<Theme> => ({
  MuiTabs: {
    styleOverrides: {
      scrollButtons: {
        width: 48,
        borderRadius: '50%',
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        opacity: 1,
        minWidth: 48,
        minHeight: 48,
        '&:not(:last-of-type)': {
          marginRight: theme.spacing(1),
          [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(5),
          },
        },
      }),
    },
  },
});
