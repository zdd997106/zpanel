import { alpha, Components, Theme } from '@mui/material/styles';

// ----------

export const getCardOverwrites = (): Components<Theme> => ({
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        position: 'relative',
        boxShadow: `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(
          theme.palette.grey[500],
          0.12,
        )}`,
        borderRadius: theme.shape.borderRadius * 2,
        zIndex: 0, // Fix Safari overflow: hidden with border radius
      }),
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3, 3, 0),
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
      }),
    },
  },
});
