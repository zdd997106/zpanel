import { getAppBarOverwrites } from './getAppBarOverwrites';
import { getLinkOverwrites } from './getLinkOverwrites';
import { getPopoverOverwrites } from './getPopoverOverwrites';
import { getTextFieldOverwrites } from './getTextFieldOverwrites';
import { getTabsOverwrites } from './getTabsOverwrites';
import { getCardOverwrites } from './getCardOverwrites';
import { getTableOverwrites } from './getTableOverwrites';
import { getModalOverwrites } from './getModalOverwrites';
import { getButtonOverwrites } from './getButtonOverwrites';
import { getMenuOverwrites } from './getMenuOverwrites';
import { getBreadcrumbsOverwrites } from './getBreadcrumbsOverwrites';

// ----------

export const overwrites = {
  ...getAppBarOverwrites(),
  ...getLinkOverwrites(),
  ...getPopoverOverwrites(),
  ...getTextFieldOverwrites(),
  ...getTabsOverwrites(),
  ...getCardOverwrites(),
  ...getTableOverwrites(),
  ...getModalOverwrites(),
  ...getButtonOverwrites(),
  ...getMenuOverwrites(),
  ...getBreadcrumbsOverwrites(),
};
