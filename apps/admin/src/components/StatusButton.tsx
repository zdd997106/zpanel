'use client';

import { noop } from 'lodash';
import { IconButton, IconButtonProps } from '@mui/material';
import { EPermissionStatus } from '@zpanel/core';

import Icons from 'src/icons';

// ----------

export interface StatusButtonProps extends Omit<IconButtonProps, 'value' | 'onChange'> {
  value?: EPermissionStatus;
  onChange?: (value: EPermissionStatus) => void;
}

/**
 *
 * A button that toggles between enabled and disabled states.
 *
 */
export default function StatusButton({ value, onChange: setValue = noop }: StatusButtonProps) {
  // --- FUNCTIONS ---

  const isEnable = () => value === EPermissionStatus.ENABLED;

  const toggle = () =>
    setValue(isEnable() ? EPermissionStatus.DISABLED : EPermissionStatus.ENABLED);

  return (
    <IconButton color="default" onClick={toggle}>
      {isEnable() ? (
        <Icons.ToggleOn fontSize="medium" color="primary" />
      ) : (
        <Icons.ToggleOff fontSize="medium" />
      )}
    </IconButton>
  );
}
