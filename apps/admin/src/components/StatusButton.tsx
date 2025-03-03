'use client';

import { isObject, noop } from 'lodash';
import { combineCallbacks } from 'gexii/utils';
import { IconButton, IconButtonProps } from '@mui/material';

import Icons from 'src/icons';
import { withDefaultProps } from 'src/hoc';

// ----------

export interface StatusButtonProps<T = boolean>
  extends Omit<IconButtonProps, 'value' | 'onChange'> {
  value?: T;
  error?: boolean;
  valueConfig?: { true: T; false: T };
  onChange?: (value: T) => void;
}

/**
 *
 * A button that toggles between enabled and disabled states.
 *
 */
export default function StatusButton<T>({
  value,
  valueConfig,
  color = 'primary',
  error: _error, // [NOTE] Error is not used in this component
  onChange: setValue = noop,
  ...props
}: StatusButtonProps<T>) {
  const valTrue = (isObject(valueConfig) ? valueConfig.true : true) as T;
  const valFalse = (isObject(valueConfig) ? valueConfig.false : false) as T;

  // --- FUNCTIONS ---

  const isEnable = () => value === valTrue;

  const toggle = () => setValue(isEnable() ? valFalse : valTrue);

  return (
    <IconButton
      {...props}
      color={isEnable() ? color : 'default'}
      onClick={combineCallbacks(toggle, props.onClick, preventDefault)}
    >
      {isEnable() ? (
        <Icons.ToggleOn fontSize="medium" color="inherit" />
      ) : (
        <Icons.ToggleOff fontSize="medium" color="inherit" />
      )}
    </IconButton>
  );
}

StatusButton.config = <T,>(valTrue: T, valFalse: T) => {
  return withDefaultProps(StatusButton<T>, { valueConfig: { true: valTrue, false: valFalse } });
};

// ----- HELPER FUNCTIONS -----

function preventDefault(event: React.UIEvent) {
  event.preventDefault(); // [NOTE] Prevents the onClick event from being called twice within a `FormControlLabel` control
}
