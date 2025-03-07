import {
  autocompleteClasses,
  checkboxClasses,
  dividerClasses,
  menuItemClasses,
} from '@mui/material';
import { Components, Theme } from '@mui/material/styles';

// ----------

export const getMenuOverwrites = (): Components<Theme> => ({
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(0.75, 1),
        borderRadius: theme.shape.borderRadius * 0.75,
        '&:not(:last-of-type)': { marginBottom: 4 },
        [`&.${menuItemClasses.selected}`]: {
          fontWeight: theme.typography.fontWeightSemiBold,
          backgroundColor: theme.palette.action.selected,
          '&:hover': { backgroundColor: theme.palette.action.focus },
        },
        [`& .${checkboxClasses.root}`]: {
          padding: theme.spacing(0.5),
          marginLeft: theme.spacing(-0.5),
          marginRight: theme.spacing(0.5),
        },
        [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
          backgroundColor: theme.palette.action.selected,
          '&:hover': { backgroundColor: theme.palette.action.focus },
        },
        [`&+.${dividerClasses.root}`]: { margin: theme.spacing(0.5, 0) },
      }),
    },
  },
});
