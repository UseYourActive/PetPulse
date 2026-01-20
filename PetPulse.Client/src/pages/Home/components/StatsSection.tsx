import React, { useState, useEffect } from 'react';
import { Box, Typography, Card } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';

const stats = [
  { icon: <PetsIcon sx={{ fontSize: 40 }} />, label: 'Total Pets', value: 24, color: '#667eea' },
  { icon: <PersonIcon sx={{ fontSize: 40 }} />, label: 'Pet Owners', value: 18, color: '#f093fb' },
  { icon: <EventIcon sx={{ fontSize: 40 }} />, label: 'Appointments', value: 12, color: '#4facfe' },
];

export const StatsSection: React.FC = () => {
  const [counters, setCounters] = useState([0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const intervals = stats.map((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = stat.value;
            return newCounters;
          });
        } else {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }
      }, duration / steps);
    });

    return () => intervals.forEach(clearInterval);
  }, [isVisible]);

  return (
    <Box id="stats-section" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              width: '100%',
              maxWidth: '600px',
              textAlign: 'center',
              p: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
              },
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 24px ${stat.color}33`,
              },
            }}
          >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
                  background: `${stat.color}15`,
                  color: stat.color,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {counters[index]}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Card>
        ))}
      </Box>
    </Box>
  );
};
