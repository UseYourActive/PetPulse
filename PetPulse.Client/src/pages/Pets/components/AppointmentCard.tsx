import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import type { Appointment } from '@/utils/appointmentsApi';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed' || statusLower === 'completed') return 'success';
    if (statusLower === 'scheduled') return 'info';
    if (statusLower === 'cancelled' || statusLower === 'noshow') return 'error';
    return 'warning';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const appointmentDate = new Date(appointment.date);
  const today = new Date();
  const isPast = appointmentDate < today;
  const isToday = appointmentDate.toDateString() === today.toDateString();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 280,
        borderRadius: 2,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 1.5, 
              bgcolor: isPast ? 'grey.100' : isToday ? 'info.light' : 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <EventIcon
                sx={{
                  color: isPast ? 'text.secondary' : 'primary.main',
                  fontSize: 24,
                }}
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {formatDate(appointment.date)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={appointment.status}
            color={getStatusColor(appointment.status)}
            size="small"
            sx={{ 
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        {appointment.description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {appointment.description}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {appointment.vetName && (
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
                Veterinarian
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospitalIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {appointment.vetName}
                </Typography>
              </Box>
            </Box>
          )}

          {appointment.treatments && appointment.treatments.length > 0 && (
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
                Treatments
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {appointment.treatments.map((treatment) => (
                  <Chip
                    key={treatment.id}
                    label={`${treatment.name} - $${treatment.cost.toFixed(2)}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
