import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import type { Pet } from '@/utils/petsApi';

const getPetIcon = (petType: string) => {
  const type = petType?.toLowerCase() || 'other';
  switch (type) {
    case 'dog':
      return '🐕';
    case 'cat':
      return '🐱';
    case 'bird':
      return '🐦';
    case 'rabbit':
      return '🐰';
    case 'hamster':
      return '🐹';
    default:
      return '🐾';
  }
};

const getPetIconColor = (petType: string) => {
  const type = petType?.toLowerCase() || 'other';
  switch (type) {
    case 'dog':
      return '#8B4513'; // Brown
    case 'cat':
      return '#FF6B6B'; // Coral
    case 'bird':
      return '#4ECDC4'; // Teal
    case 'rabbit':
      return '#FFE66D'; // Yellow
    case 'hamster':
      return '#FFA07A'; // Light Salmon
    default:
      return 'primary.main';
  }
};

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/pets/${pet.id}`);
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
              bgcolor: getPetIconColor(pet.type),
              width: 72,
              height: 72,
              mr: 2,
              fontSize: 48,
            }}
          >
            {getPetIcon(pet.type)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {pet.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {pet.type}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Age: {pet.age} {pet.age === 1 ? 'year' : 'years'}
          </Typography>
          {pet.ownerName && (
            <Typography variant="body2" color="textSecondary">
              Owner: {pet.ownerName}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
  
  export default PetCard;
  