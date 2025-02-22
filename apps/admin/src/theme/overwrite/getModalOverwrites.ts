import { Components, Theme } from '@mui/material/styles';

// ----------

export const getModalOverwrites = (): Components<Theme> => ({
  MuiDialog: {
    styleOverrides: {
      container: ({ theme }) => ({
        alignItems: 'start',
        overflowY: 'auto',
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
      }),

      paper: ({ theme }) => ({
        maxHeight: 'unset',
        margin: 'auto',
        width: `calc(100% - ${theme.spacing(1)})`,
      }),
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
      }),
    },
  },

  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(0, 3),
      }),
      dividers: ({ theme }) => ({
        borderTop: 0,
        borderBottomStyle: 'dashed',
        paddingBottom: theme.spacing(3),
      }),
    },
  },

  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
        '& > :not(:first-of-type)': {
          marginLeft: theme.spacing(1.5),
        },
      }),
    },
  },
});
