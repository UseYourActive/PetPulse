import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import type { DialogProps } from '@mui/material/Dialog';
import React from 'react';

interface FormModalProps extends Omit<DialogProps, 'open'> {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}

/**
 * Reusable form modal component for editing/creating items
 */
export const FormModal = React.forwardRef<HTMLDivElement, FormModalProps>(
  (
    {
      open,
      title,
      onClose,
      onSubmit,
      children,
      submitText = 'Submit',
      cancelText = 'Cancel',
      loading = false,
      ...props
    },
    ref
  ) => {
    const handleClose = (_event: {}, reason?: string) => {
      // Only allow closing via Cancel button or ESC key, not by clicking backdrop
      // In MUI, reason can be 'backdropClick' or 'escapeKeyDown'
      if (reason === 'backdropClick') {
        return; // Prevent closing on backdrop click
      }
      // Allow closing for other reasons (ESC key, button clicks)
      onClose();
    };

    return (
      <Dialog 
        ref={ref} 
        open={open} 
        {...props}
        onClose={handleClose}
      >
        <DialogTitle sx={{ px: 4, pt: 3, pb: 2 }}>{title}</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 420,
            px: 4,
            pt: 3,
            pb: 3,
          }}
        >
          {children}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            variant="outlined"
            sx={{
              minWidth: 100,
              borderColor: '#e0e0e0',
              color: '#666666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#2FA6A0',
                color: '#2FA6A0',
                borderWidth: '2px',
              },
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

FormModal.displayName = 'FormModal';
