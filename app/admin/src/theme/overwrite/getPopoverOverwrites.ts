import { Components, Theme } from '@mui/material/styles';

// ----------

export const getPopoverOverwrites = (): Components<Theme> => ({
  MuiPopover: {
    defaultProps: {
      disableScrollLock: true,
    },
  },
});
