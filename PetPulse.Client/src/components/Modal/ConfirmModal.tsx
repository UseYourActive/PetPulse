import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import type { DialogProps } from '@mui/material/Dialog';
import React from 'react';

interface ConfirmModalProps extends Omit<DialogProps, 'open'> {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  loading?: boolean;
}

/**
 * Reusable confirmation modal component
 */
export const ConfirmModal = React.forwardRef<HTMLDivElement, ConfirmModalProps>(
  (
    {
      open,
      title,
      message,
      onConfirm,
      onCancel,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmColor = 'primary',
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
      onCancel();
    };

    return (
      <Dialog 
        ref={ref} 
        open={open} 
        {...props}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            color={confirmColor}
            variant="contained"
            disabled={loading}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

ConfirmModal.displayName = 'ConfirmModal';
