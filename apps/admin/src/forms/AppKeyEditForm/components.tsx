'use client';

import { noop, uniq } from 'lodash';
import { Autocomplete, TextField } from '@mui/material';

// ----------

export interface PatternFieldProps {
  value?: string[];
  placeholder?: string;
  transform?: (value: string) => string;
  onChange?: AutocompleteChangeHandler;
}

export function PatternField({
  placeholder,
  value,
  transform = (value) => value,
  onChange = noop,
}: PatternFieldProps) {
  // --- HANDLERS ---

  const handleChange: AutocompleteChangeHandler = (event, value, reason) => {
    if (!Array.isArray(value)) return;

    if (reason !== 'createOption') return onChange(event, value, reason);

    const items = [...value];
    const newItem = (items.pop() as string).trim();
    if (!newItem) return;

    onChange(event, uniq([...items, transform(newItem)]), reason);
  };

  return (
    <Autocomplete
      value={value}
      multiple
      fullWidth
      options={[]}
      freeSolo
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          sx={{ marginTop: 1, input: { width: '100% !important' } }}
        />
      )}
    />
  );
}

// ----- RELATED TYPES -----

type AutocompleteChangeHandler = NonNullable<React.ComponentProps<typeof Autocomplete>['onChange']>;
