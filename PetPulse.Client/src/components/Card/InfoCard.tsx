import { Card, CardContent, type CardProps, Box, Typography } from '@mui/material';
import React from 'react';
import '../../styles/main.css';

interface InfoCardProps extends CardProps {
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Reusable info card component for displaying structured content
 */
export const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ title, children, icon, action, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={`card-shadow-1 card-hover ${className || ''}`}
        {...props}
      >
        {(title || icon || action) && (
          <Box className="info-card-header">
            <Box className="info-card-header-left">
              {icon && <Box className="info-card-icon">{icon}</Box>}
              {title && (
                <Typography variant="h6" className="font-weight-bold">
                  {title}
                </Typography>
              )}
            </Box>
            {action}
          </Box>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    );
  }
);

InfoCard.displayName = 'InfoCard';
