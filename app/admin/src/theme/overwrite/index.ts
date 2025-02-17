import { intersection } from 'lodash';
import { Theme, Components } from '@mui/material/styles';

import { getAppBarOverwrites } from './getAppBarOverwrites';
import { getLinkOverwrites } from './getLinkOverwrites';
import { getPopoverOverwrites } from './getPopoverOverwrites';
import { getTextFieldOverwrites } from './getTextFieldOverwrites';
import { getTabsOverwrites } from './getTabsOverwrites';
import { getCardOverwrites } from './getCardOverwrites';
import { getTableOverwrites } from './getTableOverwrites';
import { getModalOverwrites } from './getModalOverwrites';

// ----------

export const overwrites = mergeOverwrites(
  getAppBarOverwrites(),
  getLinkOverwrites(),
  getPopoverOverwrites(),
  getTextFieldOverwrites(),
  getTabsOverwrites(),
  getCardOverwrites(),
  getTableOverwrites(),
  getModalOverwrites(),
);

// ----------

function mergeOverwrites(...items: Components<Theme>[]) {
  return items.reduce(
    (merged, item) => ({
      // Processed configs
      ...merged,

      // New configs
      ...item,

      // Overlapped configs (Need to be processing)
      // [NOTE] Avoid using this feature too often, it'll be better to maintain each component just in one file
      ...intersection(Object.keys(merged), Object.keys(item)).reduce(
        (union, key) =>
          Object.assign(union, {
            [key]: [merged[key as never], item[key as never]].flat(),
          }),
        {} as Components<Theme>,
      ),
    }),
    {} as Components<Theme>,
  );
}
