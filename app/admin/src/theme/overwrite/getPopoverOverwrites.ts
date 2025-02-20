import { Components, Theme } from '@mui/material/styles';

// ----------

export const getPopoverOverwrites = (): Components<Theme> => ({
  MuiPopover: {
    defaultProps: {
      disableScrollLock: true,
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        boxShadow: `0 0 2px 0 #7774, -20px 20px 40px -4px #7774`,
      }),
    },
  },
});
