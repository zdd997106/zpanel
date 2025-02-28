'use client';

import { noop } from 'lodash';
import { useState } from 'react';
import { Box, TextField } from '@mui/material';

import { mixins } from 'src/theme';

// ----------

export interface ToggleTextFieldProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 *
 * A text field that toggles between read-only and edit mode.
 *
 */
export default function ToggleTextField({
  value,
  onChange: setValue = noop,
}: ToggleTextFieldProps) {
  const [editable, setEditable] = useState(false);

  const isEmpty = () => String(value).trim() === '';

  const disableEditMode = () => {
    setEditable(false);
  };

  return (
    <Box sx={[{ width: 'min(140px, 50dvw)', flex: 1 }, mixins.ellipse({ lines: 2 })]}>
      {!editable && (
        <Box
          component="span"
          color={isEmpty() ? 'text.disabled' : undefined}
          onClick={() => setEditable(true)}
          sx={{ minWidth: 10 }}
        >
          {!isEmpty() ? String(value) : 'Click to edit'}
        </Box>
      )}

      {editable && (
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          autoFocus
          variant="standard"
          size="small"
          placeholder="Click to edit"
          sx={{ '&&&, &&& *': { fontSize: 'inherit' } }}
          onBlur={disableEditMode}
        />
      )}
    </Box>
  );
}
