import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import React from 'react';
import '../../styles/main.css';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

/**
 * Reusable button component with loading state
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, disabled, children, loadingText = 'Loading...', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <Box className="loading-button-content">
            <CircularProgress size={20} color="inherit" />
            {loadingText}
          </Box>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';
