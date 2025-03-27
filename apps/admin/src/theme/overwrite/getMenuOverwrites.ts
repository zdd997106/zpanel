import {
  autocompleteClasses,
  checkboxClasses,
  dividerClasses,
  menuItemClasses,
} from '@mui/material';
import { Components, Theme } from '@mui/material/styles';

// ----------

export const getMenuOverwrites = (): Components<Theme> => ({
  MuiMenuItem: {},
});
