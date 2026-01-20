import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const features = [
  {
    icon: <PetsIcon sx={{ fontSize: 40 }} />,
    title: 'Pet Profiles',
    description: 'Comprehensive pet profiles with medical history, vaccination records, and health tracking.',
    color: '#2FA6A0',
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
    title: 'Health Records',
    description: 'Digital health records that you can access anytime, anywhere. Never lose important medical information.',
    color: '#3DB8B2',
  },
  {
    icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
    title: 'Easy Scheduling',
    description: 'Book appointments with trusted veterinarians in just a few clicks. Manage your pet\'s care schedule.',
    color: '#1F8A85',
  },
  {
    icon: <VaccinesIcon sx={{ fontSize: 40 }} />,
    title: 'Vaccination Tracking',
    description: 'Never miss a vaccination. Get reminders and track all your pet\'s immunization records.',
    color: '#4CAF50',
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    title: 'Medical Reports',
    description: 'Detailed medical reports and treatment plans. Share with any veterinarian instantly.',
    color: '#2196F3',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock support for all your pet care needs. We\'re here to help whenever you need us.',
    color: '#9C27B0',
  },
];

export const FeaturesSection: React.FC = () => {
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
          Everything You Need
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          A complete solution for managing your pet's health and wellness
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
          },
          gap: 4,
        }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            className="feature-card-modern"
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.4s ease',
              },
              '&:hover::before': {
                transform: 'scaleX(1)',
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 40px ${feature.color}33`,
                borderColor: feature.color,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
                  background: `${feature.color}15`,
                  color: feature.color,
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '.feature-card-modern:hover &': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.7 }}>
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
