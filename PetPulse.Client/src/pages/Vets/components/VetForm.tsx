import React from 'react';
import {
  TextField,
  Box,
} from '@mui/material';
import type { CreateVetDto } from '@/utils/vetsApi';
import '@/styles/main.css';

interface VetFormProps {
  vet: Partial<CreateVetDto>;
  onChange: (field: keyof CreateVetDto, value: any) => void;
}

const VetForm: React.FC<VetFormProps> = ({ vet, onChange }) => {
  return (
    <Box className="pt-1 display-flex flex-column gap-2">
      <TextField
        fullWidth
        label="First Name"
        value={vet.firstName || ''}
        onChange={(e) => onChange('firstName', e.target.value)}
        required
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Last Name"
        value={vet.lastName || ''}
        onChange={(e) => onChange('lastName', e.target.value)}
        required
        variant="outlined"
      />
      <TextField
        fullWidth
        type="number"
        label="Years of Experience"
        value={vet.yearsOfExperience || ''}
        onChange={(e) => onChange('yearsOfExperience', parseInt(e.target.value) || 0)}
        required
        variant="outlined"
        inputProps={{ min: 0, max: 60 }}
      />
    </Box>
  );
};

export default VetForm;
