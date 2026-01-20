import React from 'react';
import {
  TextField,
  Box,
  Rating,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import type { CreateReviewDto } from '@/utils/reviewsApi';
import '@/styles/main.css';

interface ReviewFormProps {
  review: Partial<CreateReviewDto>;
  onChange: (field: keyof CreateReviewDto, value: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ review, onChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          Rating
        </Typography>
        <Rating
          value={review.rating || 0}
          onChange={(_, newValue) => {
            onChange('rating', newValue || 0);
          }}
          precision={0.5}
          size="large"
          icon={<StarIcon sx={{ fontSize: 32 }} />}
          emptyIcon={<StarIcon sx={{ fontSize: 32, opacity: 0.3 }} />}
          sx={{
            '& .MuiRating-iconFilled': {
              color: 'warning.main',
            },
          }}
        />
      </Box>
      <TextField
        fullWidth
        label="Review Comment"
        value={review.comment || ''}
        onChange={(e) => onChange('comment', e.target.value)}
        required
        variant="outlined"
        multiline
        rows={4}
        placeholder="Share your experience with this veterinarian..."
      />
    </Box>
  );
};

export default ReviewForm;
