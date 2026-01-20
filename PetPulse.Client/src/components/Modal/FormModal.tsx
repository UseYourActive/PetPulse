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
    return (
      <Dialog ref={ref} open={open} onClose={onClose} {...props}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
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
