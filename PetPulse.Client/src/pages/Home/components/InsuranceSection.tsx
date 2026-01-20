import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SavingsIcon from '@mui/icons-material/Savings';
import SecurityIcon from '@mui/icons-material/Security';

const benefits = [
  'Coverage for accidents and illnesses',
  'Preventive care included',
  'No breed restrictions',
  '24/7 vet helpline access',
];

export const InsuranceSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8 }}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #2FA6A0 0%, #3DB8B2 50%, #1F8A85 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ShieldIcon sx={{ fontSize: 48 }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Pet Insurance Protection
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, lineHeight: 1.7 }}>
                Protect your pet's health and your wallet. Comprehensive insurance coverage
                that gives you peace of mind when your furry friend needs care most.
              </Typography>

              <Box sx={{ mb: 4 }}>
                {benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 24, color: '#4caf50' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/appointments')}
                sx={{
                  background: 'white',
                  color: '#2FA6A0',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <SavingsIcon sx={{ fontSize: 32 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Save Up to 90%
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      On veterinary bills with comprehensive coverage plans
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <SecurityIcon sx={{ fontSize: 32 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Trusted Coverage
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Backed by leading insurance providers with years of experience
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
