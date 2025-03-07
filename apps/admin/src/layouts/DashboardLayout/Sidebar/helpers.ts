import { invert } from 'gexii/utils';
import { isNull } from 'lodash';

import { NavGroupConfig, NavItemConfig } from 'src/configs';

// ----------

export function filterByPermits(
  items: NavGroupConfig[],
  isPermitted: (item: NavItemConfig) => boolean,
) {
  return filter(items);

  function filter<T extends NavGroupConfig | NavItemConfig>(items: T[]): T[] {
    return items
      .map((target) => {
        if ('permission' in target) return isPermitted(target) ? target : null;

        if ('items' in target && Array.isArray(target.items)) {
          const items = filter(target.items);
          return items.length > 0 ? { ...target, items } : null;
        }

        if ('children' in target && Array.isArray(target.children)) {
          const children = filter(target.children);
          return children.length > 0 ? { ...target, children } : null;
        }

        return target;
      })
      .filter(isNotNull);
  }
}

const isNotNull = invert(isNull);
