import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import '../../../styles/main.css';

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

/**
 * Call-to-action section component
 */
const CallToAction: React.FC<CallToActionProps> = ({
  title = "Manage Your Pet's Health",
  description = 'Schedule appointments, track medical records, and keep your pets healthy.',
  primaryButtonText = 'View All Pets',
  secondaryButtonText = 'Schedule Appointment',
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <Box className="cta-section">
      <Typography variant="h5" className="font-weight-bold mb-2">
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary" className="mb-3">
        {description}
      </Typography>
      <Box className="cta-buttons">
        <Button variant="contained" color="primary" size="large" onClick={onPrimaryClick}>
          {primaryButtonText}
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={onSecondaryClick}>
          {secondaryButtonText}
        </Button>
      </Box>
    </Box>
  );
};

export default CallToAction;
