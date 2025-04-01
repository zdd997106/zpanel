'use client';

import { forwardRef, useEffect } from 'react';
import { useFormState } from 'react-hook-form';
import { useToggle } from 'react-use';
import { TextFieldProps, TextField, InputAdornment, IconButton } from '@mui/material';
import VisibleIcon from '@mui/icons-material/VisibilityOutlined';
import InvisibleIcon from '@mui/icons-material/VisibilityOffOutlined';

// ----------

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {}

export default forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { ...props },
  ref,
) {
  const { isSubmitting } = useFormState();
  const [visible, toggleVisible] = useToggle(false);

  // --- FUNCTIONS ---

  const setInvisible = () => toggleVisible(false);

  // --- EFFECTS ---

  // reset visibility on submitting
  useEffect(() => {
    if (isSubmitting) setInvisible();
  }, [isSubmitting]);

  return (
    <TextField
      {...props}
      ref={ref}
      type={visible ? 'text' : 'password'}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => toggleVisible()} edge="end">
                {visible ? <VisibleIcon /> : <InvisibleIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
});
