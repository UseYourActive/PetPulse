import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const benefits = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Fast & Easy',
    description: 'Quick access to all your pet\'s information in one place. No more searching through paperwork.',
    color: '#2FA6A0',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure & Private',
    description: 'Your pet\'s medical records are encrypted and secure. We take privacy seriously.',
    color: '#3DB8B2',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: 'Expert Support',
    description: 'Get help from our team of veterinary professionals whenever you need guidance.',
    color: '#1F8A85',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Trusted Platform',
    description: 'Used by thousands of pet owners and veterinarians worldwide. Reliable and proven.',
    color: '#4CAF50',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          Why Choose PetPulse?
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Everything you need to manage your pet's health, all in one place
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {benefits.map((benefit, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(135deg, ${benefit.color} 0%, ${benefit.color}dd 100%)`,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 12px 32px ${benefit.color}33`,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    background: `${benefit.color}15`,
                    color: benefit.color,
                    mb: 2,
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.7 }}>
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
