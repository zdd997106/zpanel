import { Components, Theme } from '@mui/material/styles';

// ----------

export const getTabsOverwrites = (): Components<Theme> => ({
  MuiTabs: {
    styleOverrides: {
      scrollButtons: {
        width: 48,
        borderRadius: '50%',
      },
      indicator: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        height: '100%',
        zIndex: -1,
        opacity: 0.1,
      }),
    },
  },

  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.subtitle2,
        opacity: 1,
        minWidth: 48,
        minHeight: 48,
        borderRadius: theme.shape.borderRadius,
        '&:not(:last-of-type)': {
          marginRight: theme.spacing(1),
        },
      }),
    },
  },
});
