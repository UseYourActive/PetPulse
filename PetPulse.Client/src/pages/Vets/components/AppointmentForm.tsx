import React, { useEffect, useState } from 'react';
import {
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { CreateAppointmentDto } from '@/utils/appointmentsApi';
import type { Pet } from '@/utils/petsApi';
import { petsApi } from '@/utils/petsApi';
import '@/styles/main.css';

interface AppointmentFormProps {
  appointment: Partial<CreateAppointmentDto>;
  onChange: (field: keyof CreateAppointmentDto, value: any) => void;
  vetId: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onChange, vetId: _vetId }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState<string | null>(null);
  const [dateValue, setDateValue] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');

  useEffect(() => {
    loadPets();
    if (appointment.date) {
      const date = new Date(appointment.date);
      // Format for HTML5 date input (YYYY-MM-DD)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setDateValue(`${year}-${month}-${day}`);
      const hours = date.getHours();
      const minutes = Math.round(date.getMinutes() / 30) * 30; // Round to nearest 30 minutes
      const h = String(hours).padStart(2, '0');
      const m = String(minutes).padStart(2, '0');
      setTimeValue(`${h}:${m}`);
    }
  }, []);

  const loadPets = async () => {
    setLoadingPets(true);
    setPetsError(null);
    try {
      const data = await petsApi.getPets();
      setPets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setPetsError(err.response?.data?.message || 'Failed to load pets');
    } finally {
      setLoadingPets(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);
    updateDateTime(value, timeValue);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTimeValue(value);
    updateDateTime(dateValue, value);
  };

  const updateDateTime = (dateStr: string, timeStr: string) => {
    if (dateStr && timeStr) {
      // Parse YYYY-MM-DD format (HTML5 date input)
      const [year, month, day] = dateStr.split('-');
      // Parse HH:MM format
      const [hours, minutes] = timeStr.split(':');
      
      if (day && month && year && hours && minutes) {
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
        onChange('date', date.toISOString());
      }
    }
  };

  // Generate time options with 30-minute intervals
  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        times.push(`${h}:${m}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loadingPets ? (
        <Box className="display-flex justify-content-center py-2">
          <CircularProgress size={24} />
        </Box>
      ) : petsError ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          {petsError}
        </Alert>
      ) : pets.length === 0 ? (
        <Alert severity="info" sx={{ mb: 1 }}>
          You need to add a pet before scheduling an appointment.
        </Alert>
      ) : (
        <>
          <TextField
            fullWidth
            select
            label="Pet"
            value={appointment.petId || ''}
            onChange={(e) => onChange('petId', e.target.value)}
            required
            variant="outlined"
            size="small"
          >
            {pets.map((pet) => (
              <MenuItem key={pet.id} value={String(pet.id)}>
                {pet.name} ({pet.type}, {pet.age} {pet.age === 1 ? 'year' : 'years'})
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={dateValue}
              onChange={handleDateChange}
              required
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0], // Prevent past dates
                style: {
                  color: '#333333',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2FA6A0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2FA6A0',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2FA6A0',
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  cursor: 'pointer',
                  filter: 'invert(47%) sepia(89%) saturate(1200%) hue-rotate(150deg) brightness(95%) contrast(85%)',
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                  },
                },
              }}
            />
            <TextField
              fullWidth
              select
              label="Time (HH:MM)"
              value={timeValue}
              onChange={handleTimeChange}
              required
              variant="outlined"
              size="small"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                },
              }}
            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={appointment.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            required
            variant="outlined"
            size="small"
            placeholder="Reason for visit, symptoms, or concerns..."
          />
        </>
      )}
    </Box>
  );
};

export default AppointmentForm;
