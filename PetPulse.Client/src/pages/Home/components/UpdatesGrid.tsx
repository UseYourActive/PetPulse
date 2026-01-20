import { Box, Card, CardContent, Grid, Chip, Typography } from '@mui/material';
import React from 'react';
import '../../../styles/main.css';

interface Update {
  id: number;
  title: string;
  description: string;
  date: string;
  pet: string;
  status: 'completed' | 'upcoming' | 'pending';
}

interface UpdatesGridProps {
  updates: Update[];
}

/**
 * Recent updates grid component displaying pet status updates
 */
const UpdatesGrid: React.FC<UpdatesGridProps> = ({ updates }) => {
  return (
    <Box className="updates-grid">
      <Typography variant="h4" className="font-weight-bold mb-3">
        Recent Pet Updates
      </Typography>
      <Grid container spacing={3}>
        {updates.map((update) => (
          <Grid item xs={12} key={update.id}>
            <Card className="updates-card">
              <CardContent>
                <Box className="update-item-layout">
                  <Box>
                    <Typography variant="h6" className="font-weight-bold">
                      {update.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mt-1">
                      {update.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={update.status}
                    color={update.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box className="update-meta-layout">
                  <Typography variant="caption" color="textSecondary">
                    {update.pet} • {update.date}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UpdatesGrid;
