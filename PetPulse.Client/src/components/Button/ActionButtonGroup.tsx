import { Button, ButtonGroup, ButtonGroupProps } from '@mui/material';
import React from 'react';

interface ButtonGroupItem {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  disabled?: boolean;
}

interface ActionButtonGroupProps extends ButtonGroupProps {
  buttons: ButtonGroupItem[];
}

/**
 * Reusable button group component for action buttons
 */
export const ActionButtonGroup = React.forwardRef<HTMLDivElement, ActionButtonGroupProps>(
  ({ buttons, ...props }, ref) => {
    return (
      <ButtonGroup ref={ref} {...props}>
        {buttons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            variant={btn.variant || 'outlined'}
            color={btn.color || 'primary'}
            disabled={btn.disabled}
          >
            {btn.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
);

ActionButtonGroup.displayName = 'ActionButtonGroup';
