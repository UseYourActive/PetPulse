import React from 'react';
import {
  TextField,
  Box,
} from '@mui/material';
import type { Owner } from '@/utils/ownersApi';
import '@/styles/main.css';

interface OwnerFormProps {
  owner: Partial<Owner>;
  onChange: (field: keyof Owner, value: any) => void;
}

const OwnerForm: React.FC<OwnerFormProps> = ({ owner, onChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="First Name"
        value={owner.firstName || ''}
        onChange={(e) => onChange('firstName', e.target.value)}
        required
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Last Name"
        value={owner.lastName || ''}
        onChange={(e) => onChange('lastName', e.target.value)}
        required
        variant="outlined"
      />
      <TextField
        fullWidth
        type="email"
        label="Email"
        value={owner.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
        required
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={owner.phoneNumber || ''}
        onChange={(e) => onChange('phoneNumber', e.target.value)}
        variant="outlined"
      />
    </Box>
  );
};

export default OwnerForm;
