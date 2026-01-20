import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState } from 'react';

interface PasswordInputProps extends Omit<TextFieldProps, 'variant' | 'type'> {
  error?: boolean;
  helperText?: string;
}

/**
 * Reusable password input component with visibility toggle
 */
export const PasswordInput = React.forwardRef<HTMLDivElement, PasswordInputProps>(
  ({ error, helperText, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <TextField
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
