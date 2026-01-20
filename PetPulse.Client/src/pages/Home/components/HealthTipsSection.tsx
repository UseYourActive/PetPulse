import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';

const healthTips = [
  {
    icon: <FavoriteIcon sx={{ fontSize: 32 }} />,
    title: 'Regular Check-ups',
    description: 'Annual veterinary exams are crucial for early detection of health issues. Prevention is always better than treatment.',
    tip: 'Schedule check-ups every 6-12 months',
    color: '#f44336',
  },
  {
    icon: <LocalDiningIcon sx={{ fontSize: 32 }} />,
    title: 'Balanced Nutrition',
    description: 'Proper nutrition is the foundation of good health. Feed your pet high-quality food appropriate for their age and breed.',
    tip: 'Consult your vet for dietary recommendations',
    color: '#ff9800',
  },
  {
    icon: <FitnessCenterIcon sx={{ fontSize: 32 }} />,
    title: 'Daily Exercise',
    description: 'Regular physical activity keeps pets healthy, prevents obesity, and improves mental well-being.',
    tip: 'Aim for 30-60 minutes of activity daily',
    color: '#4caf50',
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
    title: 'Mental Stimulation',
    description: 'Mental health matters too! Provide toys, puzzles, and interactive play to keep your pet\'s mind sharp.',
    tip: 'Rotate toys to maintain interest',
    color: '#2196f3',
  },
];

export const HealthTipsSection: React.FC = () => {
  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, rgba(47, 166, 160, 0.05) 0%, rgba(61, 184, 178, 0.05) 100%)',
        borderRadius: 4,
        px: 4,
        my: 4,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Chip
          label="Pet Health Tips"
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #2FA6A0 0%, #1F8A85 100%)',
            color: 'white',
            fontWeight: 600,
            px: 1,
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, #2FA6A0 0%, #1F8A85 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Caring for Your Pet's Health
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Essential tips to keep your furry friends happy and healthy
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {healthTips.map((tip, index) => (
          <Card
            key={index}
            sx={{
              width: '100%',
              maxWidth: '600px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 24px ${tip.color}33`,
              },
            }}
          >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `${tip.color}15`,
                      color: tip.color,
                      flexShrink: 0,
                    }}
                  >
                    {tip.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {tip.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                      {tip.description}
                    </Typography>
                    <Chip
                      label={tip.tip}
                      size="small"
                      sx={{
                        background: `${tip.color}20`,
                        color: tip.color,
                        fontWeight: 600,
                        border: `1px solid ${tip.color}40`,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>
    </Box>
  );
};
