import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

interface TextInputProps extends Omit<TextFieldProps, 'variant'> {
  error?: boolean;
  helperText?: string;
}

/**
 * Reusable text input component based on MUI TextField
 * Provides consistent styling and behavior across forms
 */
export const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>(
  ({ error, helperText, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        fullWidth
        error={error}
        helperText={helperText}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
