import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import backgroundImage from '../../../assets/background-image.png';

interface HeroSectionProps {
  scrollY: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollY: _scrollY }) => {
  const navigate = useNavigate();

  // Generate bokeh circles with fixed positions for consistency
  const bokehCircles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      size: 100 + (i * 13) % 150,
      x: (i * 23) % 100,
      y: (i * 37) % 100,
      opacity: 0.1 + ((i * 7) % 20) / 100,
      delay: (i * 0.3) % 2,
      duration: 8 + ((i * 11) % 4),
    }));
  }, []);

  return (
    <Box
      className="hero-section"
      sx={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'radial-gradient(ellipse at 20% 100%, rgba(139, 195, 74, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(139, 195, 74, 0.15) 0%, transparent 50%)',
          zIndex: 0,
        },
      }}
    >
      {/* Bokeh effects */}
      {bokehCircles.map((circle, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            filter: 'blur(40px)',
            opacity: circle.opacity,
            animation: `float ${circle.duration}s ease-in-out infinite`,
            animationDelay: `${circle.delay}s`,
            zIndex: 0,
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translate(0, 0) scale(1)',
              },
              '50%': {
                transform: 'translate(30px, -30px) scale(1.1)',
              },
            },
          }}
        />
      ))}
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            py: 8,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              background: 'rgba(240, 240, 240, 0.95)',
              border: '1px solid rgba(220, 220, 220, 0.3)',
            }}
          >
            <FavoriteIcon sx={{ color: '#ff6b9d', fontSize: '1.1rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
              Trusted by thousands of pet owners
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 800,
              mb: 3,
              color: 'white',
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            Your Pet's Health,
            <br />
            Our Priority
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 5,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 300,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Comprehensive veterinary care management system. Track health records,
            schedule appointments, and ensure your furry friends receive the best care.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/pets')}
              sx={{
                px: '34px',
                py: '14px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#ffffff',
                background: 'linear-gradient(90deg, #7ddad3, #3fb1a8)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '10px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.25), 0 4px 18px rgba(0, 0, 0, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.3), 0 6px 20px rgba(0, 0, 0, 0.18)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: 'inset 0 0 6px rgba(255, 255, 255, 0.23), 0 3px 14px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              GET STARTED
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/appointments')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: 'rgba(245, 245, 245, 0.95)',
                color: '#333',
                border: '1px solid rgba(220, 220, 220, 0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                '&:hover': {
                  background: 'rgba(250, 250, 250, 0.98)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Schedule Appointment
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              mt: 8,
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: <PetsIcon />, text: 'Pet Care' },
              { icon: <LocalHospitalIcon />, text: 'Health Records' },
              { icon: <FavoriteIcon />, text: 'Expert Care' },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  width: { xs: '140px', sm: '160px' },
                  height: { xs: '140px', sm: '160px' },
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
                  },
                }}
              >
                <Box sx={{ fontSize: '2.5rem', color: 'white', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
