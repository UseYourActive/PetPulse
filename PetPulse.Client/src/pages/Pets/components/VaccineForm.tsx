import React from 'react';
import {
  TextField,
  Box,
} from '@mui/material';
import type { CreateVaccineDto } from '@/utils/vaccinesApi';
import '@/styles/main.css';

interface VaccineFormProps {
  vaccine: Partial<CreateVaccineDto>;
  onChange: (field: keyof CreateVaccineDto, value: any) => void;
}

const VaccineForm: React.FC<VaccineFormProps> = ({ vaccine, onChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Vaccine Name"
        value={vaccine.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        required
        variant="outlined"
        placeholder="e.g., Rabies, DHPP, FVRCP"
      />
      <TextField
        fullWidth
        type="datetime-local"
        label="Date Administered"
        value={vaccine.dateAdministered ? new Date(vaccine.dateAdministered).toISOString().slice(0, 16) : ''}
        onChange={(e) => onChange('dateAdministered', e.target.value ? new Date(e.target.value).toISOString() : '')}
        required
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        type="datetime-local"
        label="Expiry Date"
        value={vaccine.expiryDate ? new Date(vaccine.expiryDate).toISOString().slice(0, 16) : ''}
        onChange={(e) => onChange('expiryDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
        required
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
};

export default VaccineForm;
