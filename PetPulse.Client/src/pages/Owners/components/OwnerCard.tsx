import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import { CardHoverOverlay } from '@/components/Card/CardHoverOverlay';
import type { Owner } from '@/utils/ownersApi';
import PersonIcon from '@mui/icons-material/Person';

interface OwnerCardProps {
  owner: Owner;
  onEdit: (owner: Owner) => void;
  onDelete: (owner: Owner) => void;
}

const OwnerCard: React.FC<OwnerCardProps> = ({ owner, onEdit, onDelete }) => {
  const fullName = `${owner.firstName} ${owner.lastName}`;
  
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 72,
              height: 72,
              mr: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {fullName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {owner.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {owner.phoneNumber && (
            <Typography variant="body2" color="textSecondary">
              Phone: {owner.phoneNumber}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardHoverOverlay
        onEdit={() => onEdit(owner)}
        onDelete={() => onDelete(owner)}
      />
    </Card>
  );
};

export default OwnerCard;
