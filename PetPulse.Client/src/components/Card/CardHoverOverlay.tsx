import React from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../styles/main.css';

interface CardHoverOverlayProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const CardHoverOverlay: React.FC<CardHoverOverlayProps> = ({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
}) => {
  return (
    <Box className="card-hover-overlay">
      <Box className="card-hover-overlay-content">
        {showEdit && onEdit && (
          <IconButton
            className="card-overlay-button card-overlay-button-edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="edit"
            size="large"
          >
            <EditIcon />
          </IconButton>
        )}
        {showDelete && onDelete && (
          <IconButton
            className="card-overlay-button card-overlay-button-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="delete"
            size="large"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
