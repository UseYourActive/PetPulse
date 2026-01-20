import { Box, Typography } from '@mui/material';
import React from 'react';
import '../../../styles/main.css';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Home page header component
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <Box className="page-header">
      <Typography 
        variant="h3" 
        component="h1" 
        className="page-header-title"
        sx={{
          background: 'linear-gradient(135deg, #2FA6A0 0%, #3DB8B2 50%, #1F8A85 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default PageHeader;
