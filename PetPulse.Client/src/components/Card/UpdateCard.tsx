import { Card, CardContent, type CardProps, Box, Typography } from '@mui/material';
import React from 'react';
import '../../styles/main.css';

interface UpdateCardProps extends CardProps {
  title: string;
  description?: string;
  date?: string;
  status?: 'completed' | 'upcoming' | 'pending';
  metadata?: string;
}

/**
 * Reusable update card component for displaying status updates
 */
export const UpdateCard = React.forwardRef<HTMLDivElement, UpdateCardProps>(
  ({ title, description, date, status, metadata, className, ...props }, ref) => {
    const statusConfig = {
      completed: { colorClass: 'chip-success' },
      upcoming: { colorClass: 'chip-warning' },
      pending: { colorClass: 'chip-info' },
    };

    const config = status ? statusConfig[status] : { colorClass: 'chip-default' };

    return (
      <Card
        ref={ref}
        className={`card-shadow-1 card-border-left card-hover-bg ${className || ''}`}
        {...props}
      >
        <CardContent>
          <Box className="update-card-layout">
            <Box>
              <Typography variant="h6" className="font-weight-bold">
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" color="textSecondary" className="mt-1">
                  {description}
                </Typography>
              )}
            </Box>
            {status && (
              <span className={`chip chip-small ${config.colorClass}`}>
                {status}
              </span>
            )}
          </Box>
          {(date || metadata) && (
            <Typography variant="caption" color="textSecondary">
              {metadata && `${metadata} • `}
              {date}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }
);

UpdateCard.displayName = 'UpdateCard';
