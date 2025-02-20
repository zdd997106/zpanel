import { SvgIcon, SvgIconProps } from '@mui/material';
import { createElement } from 'react';
import * as Icons from './icons';

type IconKey = keyof typeof Icons;

export function findIcon(key: IconKey | (string & {}) | undefined | null, defaultIcon = SvgIcon) {
  if (!key || !(key in Icons)) return defaultIcon;
  return Icons[key as never];
}

export function createIcon(
  key: string | (string & {}) | undefined | null,
  props: SvgIconProps = {},
  { defaultIcon = SvgIcon } = {},
) {
  const Icon = findIcon(key, defaultIcon);
  return createElement(Icon, props);
}
