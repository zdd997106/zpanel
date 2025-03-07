import type { Components, Theme } from '@mui/material/styles';

export const getBreadcrumbsOverwrites = (): Components<Theme> => ({
  MuiBreadcrumbs: {
    defaultProps: {
      separator: ' • ',
    },

    styleOverrides: {},
  },
});
