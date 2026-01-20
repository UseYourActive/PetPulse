import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import type { Pet } from '../../../utils/petsApi';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 2,
        transition: 'all 0.3s ease',
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
              width: 56,
              height: 56,
              mr: 2,
            }}
          >
            <PetsIcon sx={{ fontSize: 32 }} />
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
  
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <IconButton
            color="primary"
            onClick={() => onEdit(pet)}
            aria-label="edit pet"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(pet)}
            aria-label="delete pet"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  };
  
  export default PetCard;
  