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
      <Typography variant="h3" component="h1" className="page-header-title">
        {title}
      </Typography>
      <Typography variant="h6" color="textSecondary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default PageHeader;
