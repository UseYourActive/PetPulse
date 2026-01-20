import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Vaccine } from '@/utils/vaccinesApi';

interface VaccineCardProps {
  vaccine: Vaccine;
  onDelete: (vaccine: Vaccine) => void;
}

const VaccineCard: React.FC<VaccineCardProps> = ({ vaccine, onDelete }) => {
  const expiryDate = new Date(vaccine.expiryDate);
  const today = new Date();
  const isExpired = expiryDate < today;
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  const getStatusColor = () => {
    if (isExpired) return 'error';
    if (isExpiringSoon) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isExpiringSoon) return `Expires in ${daysUntilExpiry} days`;
    return 'Active';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isExpired ? '2px solid' : '1px solid',
        borderColor: isExpired ? 'error.main' : 'divider',
        minWidth: 280,
        borderRadius: 2,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
          borderColor: isExpired ? 'error.dark' : 'primary.main',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 1.5, 
              bgcolor: isExpired ? 'error.light' : isExpiringSoon ? 'warning.light' : 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <VaccinesIcon
                sx={{
                  color: isExpired ? 'error.main' : isExpiringSoon ? 'warning.main' : 'success.main',
                  fontSize: 24,
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {vaccine.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => onDelete(vaccine)}
            sx={{ 
              ml: 1,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
              Administered
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {formatDate(vaccine.dateAdministered)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
              Expiry Date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isExpired ? 'error.main' : isExpiringSoon ? 'warning.main' : 'text.primary',
              }}
            >
              {formatDate(vaccine.expiryDate)}
            </Typography>
          </Box>

          <Box sx={{ mt: 0.5 }}>
            <Chip
              label={getStatusText()}
              color={getStatusColor()}
              size="small"
              sx={{ 
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VaccineCard;
