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

const gradientConfigs = [
  {
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
    topBar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    iconGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    valueGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #fef3f2 100%)',
    topBar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    iconGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    valueGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
    topBar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    iconGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    valueGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

/**
 * Statistics grid component displaying key metrics
 */
const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <Grid container spacing={3} className="stats-grid">
      {stats.map((stat, index) => {
        const gradient = gradientConfigs[index % gradientConfigs.length];
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              className="stats-card"
              sx={{
                background: gradient.cardBg,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: gradient.topBar,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.4s ease',
                },
                '&:hover::before': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              <Box 
                className="stats-icon"
                sx={{
                  '& svg': {
                    background: gradient.iconGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  },
                }}
              >
                {stat.icon}
              </Box>
              <Typography 
                variant="h5" 
                className="font-weight-bold mb-1"
                sx={{
                  background: gradient.valueGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsGrid;
