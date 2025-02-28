'use client';

/* eslint-disable no-bitwise */

import { noop } from 'lodash';
import { Checkbox, CheckboxProps } from '@mui/material';

// ----------

export interface BitwiseCheckboxProps extends Omit<CheckboxProps, 'value' | 'onChange' | 'action'> {
  value?: number;
  mask: number;
  error?: boolean;
  onChange?: (value: number) => void;
}

/**
 * A checkbox that toggles a bitwise flag in a number using a mask.
 */
export default function BitwiseCheckbox({
  value = 0,
  mask,
  onChange: setValue = noop,
  error,
  color = error ? 'error' : 'default',
  ...props
}: BitwiseCheckboxProps) {
  const checked = Boolean((value & mask) === mask);

  const indeterminate = !checked && Boolean((value & mask) > 0);

  const setChecked = (checked: boolean) => {
    setValue(checked ? value | mask : value & ~mask);
  };

  return (
    <Checkbox
      {...props}
      color={color}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(_event, checked) => setChecked(checked)}
    />
  );
}
