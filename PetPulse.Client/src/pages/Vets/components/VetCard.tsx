import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { CardHoverOverlay } from '@/components/Card/CardHoverOverlay';
import type { Vet } from '@/utils/vetsApi';

interface VetCardProps {
  vet: Vet;
  onEdit: (vet: Vet) => void;
  onDelete: (vet: Vet) => void;
  onAppointmentClick?: (vet: Vet) => void;
  canEdit?: boolean;
}

const VetCard: React.FC<VetCardProps> = ({ vet, onEdit, onDelete, onAppointmentClick, canEdit = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/vets/${vet.id}`);
  };

  return (
    <Card
      className="card-with-hover-overlay"
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 72,
              height: 72,
              mr: 2,
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {vet.fullName}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {canEdit && (
        <CardHoverOverlay
          onEdit={(e) => {
            e?.stopPropagation();
            onEdit(vet);
          }}
          onDelete={(e) => {
            e?.stopPropagation();
            onDelete(vet);
          }}
        />
      )}
    </Card>
  );
};

export default VetCard;
