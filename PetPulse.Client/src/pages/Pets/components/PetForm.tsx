import React from 'react';
import {
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import type { Pet } from '@/utils/petsApi';
import '@/styles/main.css';

interface PetFormProps {
pet: Partial<Pet>;
onChange: (field: keyof Pet, value: any) => void;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Pet Name"
        value={pet.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        required
        variant="outlined"
      />
      <TextField
        fullWidth
        select
        label="Type"
        value={pet.type || ''}
        onChange={(e) => onChange('type', e.target.value)}
        required
        variant="outlined"
      >
        <MenuItem value="Dog">Dog</MenuItem>
        <MenuItem value="Cat">Cat</MenuItem>
        <MenuItem value="Bird">Bird</MenuItem>
        <MenuItem value="Rabbit">Rabbit</MenuItem>
        <MenuItem value="Hamster">Hamster</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>
      <TextField
        fullWidth
        type="number"
        label="Age (years)"
        value={pet.age || ''}
        onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
        required
        variant="outlined"
        inputProps={{ min: 0, max: 50 }}
      />
    </Box>
  );
};

  export default PetForm;
  