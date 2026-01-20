import { Container, ContainerProps, Box } from '@mui/material';
import React from 'react';

interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
}

/**
 * Reusable page container component for consistent page layout
 */
export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Container
        ref={ref}
        maxWidth="lg"
        sx={{
          py: 4,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Container>
    );
  }
);

PageContainer.displayName = 'PageContainer';
