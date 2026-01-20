import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      navigate('/pets');
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      navigate('/appointments');
    }
  };

  return (
    <Box className="cta-section">
      <Typography 
        variant="h5" 
        className="font-weight-bold"
        sx={{ 
          lineHeight: 1.6, 
          mb: 3,
          background: 'linear-gradient(135deg, #2FA6A0 0%, #1F8A85 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="textSecondary" 
        sx={{ lineHeight: 1.8, mb: 4, fontWeight: 400 }}
      >
        {description}
      </Typography>
      <Box className="cta-buttons">
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={handlePrimaryClick}
          sx={{
            background: 'linear-gradient(135deg, #2FA6A0 0%, #3DB8B2 50%, #1F8A85 100%)',
            boxShadow: '0 4px 15px rgba(47, 166, 160, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1F8A85 0%, #3DB8B2 50%, #2FA6A0 100%)',
              boxShadow: '0 6px 20px rgba(47, 166, 160, 0.5)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {primaryButtonText}
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          onClick={handleSecondaryClick}
          sx={{
            borderWidth: '2px',
            borderColor: '#2FA6A0',
            color: '#2FA6A0',
            fontWeight: 600,
            '&:hover': {
              borderWidth: '2px',
              borderColor: '#1F8A85',
              background: 'linear-gradient(135deg, rgba(47, 166, 160, 0.1) 0%, rgba(61, 184, 178, 0.1) 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(47, 166, 160, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {secondaryButtonText}
        </Button>
      </Box>
    </Box>
  );
};

export default CallToAction;
