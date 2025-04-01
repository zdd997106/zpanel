'use client';

import { get, noop, set } from 'lodash';
import { combineCallbacks } from 'gexii/utils';
import { useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSleep } from 'gexii/hooks';
import { TextFieldProps, TextField, TextFieldVariants, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseRounded';

import { inputValue } from '../utils';

export type SearchFieldProps<Variant extends TextFieldVariants> = TextFieldProps<Variant>;

export default function SearchField<Variant extends TextFieldVariants>({
  onChange = noop,
  variant = 'outlined' as TextFieldVariants,
  ...props
}: SearchFieldProps<Variant>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value);
  const lastChangeEvent = useRef<React.ChangeEvent<HTMLInputElement> | null>(null);
  const sleep = useSleep();

  // --- FUNCTIONS ---

  const clearValue = async () => {
    const target = inputRef.current;
    if (!target) return;

    inputValue(target, '');

    await sleep();
    onChange?.(lastChangeEvent.current!);
  };

  function getSlotProps() {
    const endAdornment = !!props.value && (
      <IconButton size="small" onClick={clearValue}>
        <CloseIcon fontSize="small" />
      </IconButton>
    );

    return set(
      props.slotProps ?? {},
      'input.endAdornment',
      get(props.slotProps, 'input.endAdornment', endAdornment),
    );
  }

  // --- HANDLERS ---

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
    lastChangeEvent.current = event;
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      onChange?.(lastChangeEvent.current!);
    }
  };

  // --- EFFECTS ---

  useUpdateEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <TextField
      {...props}
      inputRef={inputRef}
      value={value}
      variant={variant}
      slotProps={getSlotProps()}
      onChange={handleChange}
      onKeyDown={combineCallbacks(handleKeyDown, props.onKeyDown)}
    />
  );
}
