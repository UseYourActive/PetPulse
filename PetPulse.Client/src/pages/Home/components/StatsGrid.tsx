import { Grid, Card, Box, Typography } from '@mui/material';
import React from 'react';
import '../../../styles/main.css';

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface StatsGridProps {
  stats: Stat[];
}

/**
 * Statistics grid component displaying key metrics
 */
const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <Grid container spacing={3} className="stats-grid">
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card className="stats-card">
            <Box className="stats-icon">
              {stat.icon}
            </Box>
            <Typography variant="h5" className="font-weight-bold mb-1">
              {stat.value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {stat.label}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsGrid;
