import { Alert, AlertProps, Box } from '@mui/material';
import React from 'react';

interface FormAlertProps extends AlertProps {
  message?: string;
  visible?: boolean;
}

/**
 * Reusable form alert component for displaying success/error messages
 */
export const FormAlert = React.forwardRef<HTMLDivElement, FormAlertProps>(
  ({ message, visible = true, sx, ...props }, ref) => {
    if (!visible || !message) {
      return null;
    }

    return (
      <Box sx={{ mb: 2, ...sx }}>
        <Alert ref={ref} {...props}>
          {message}
        </Alert>
      </Box>
    );
  }
);

FormAlert.displayName = 'FormAlert';
