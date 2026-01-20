import { Box, BoxProps, Typography } from '@mui/material';
import React from 'react';

interface PageHeaderProps extends BoxProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Reusable page header component
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, subtitle, action, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          ...sx,
        }}
        {...props}
      >
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    );
  }
);

PageHeader.displayName = 'PageHeader';
