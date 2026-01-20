import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Event as EventIcon,
  Pets as PetsIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { CardHoverOverlay } from '@/components/Card/CardHoverOverlay';
import type { Appointment, AppointmentStatus } from '@/utils/appointmentsApi';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onStatusUpdate?: (appointment: Appointment, status: AppointmentStatus) => void;
  canEdit?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  canEdit = false,
}) => {
  const handleEditClick = () => {
    onEdit?.(appointment);
  };

  const handleDeleteClick = () => {
    onDelete?.(appointment);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed' || statusLower === 'completed') return 'success';
    if (statusLower === 'scheduled') return 'info';
    if (statusLower === 'cancelled' || statusLower === 'noshow') return 'error';
    return 'warning';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      className="card-with-hover-overlay"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatDate(appointment.date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={appointment.status}
              color={getStatusColor(appointment.status)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        {appointment.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {appointment.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PetsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>Pet:</strong> {appointment.petName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>Owner:</strong> {appointment.ownerName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospitalIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>Veterinarian:</strong> {appointment.vetName}
            </Typography>
          </Box>
          {appointment.treatments && appointment.treatments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Treatments:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {appointment.treatments.map((treatment) => (
                  <Chip
                    key={treatment.id}
                    label={`${treatment.name} - $${treatment.cost}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>

      {canEdit && (
        <CardHoverOverlay
          onEdit={onEdit ? handleEditClick : undefined}
          onDelete={onDelete ? handleDeleteClick : undefined}
          showEdit={!!onEdit}
          showDelete={!!onDelete}
        />
      )}
    </Card>
  );
};

export default AppointmentCard;
