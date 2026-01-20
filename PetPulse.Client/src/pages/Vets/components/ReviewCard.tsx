import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  IconButton,
  Chip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import type { Review } from '@/utils/reviewsApi';

interface ReviewCardProps {
  review: Review;
  onDelete: (review: Review) => void;
  canDelete?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete, canDelete = false }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 1.5, 
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PersonIcon
                sx={{
                  color: 'primary.main',
                  fontSize: 24,
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                {review.ownerName || review.userName || 'Anonymous'}
              </Typography>
              {(review.datePosted || review.createdAt) && (
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                  {formatDate(review.datePosted || review.createdAt)}
                </Typography>
              )}
            </Box>
          </Box>
          {canDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(review)}
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
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Rating
            value={review.rating}
            readOnly
            precision={0.5}
            size="small"
            icon={<StarIcon sx={{ fontSize: 20 }} />}
            emptyIcon={<StarIcon sx={{ fontSize: 20, opacity: 0.3 }} />}
            sx={{
              '& .MuiRating-iconFilled': {
                color: 'warning.main',
              },
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            lineHeight: 1.6,
            wordBreak: 'break-word',
          }}
        >
          {review.comment}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
