import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import { useAuth } from '@/context/AuthContext';
import { appointmentsApi } from '@/utils/appointmentsApi';
import type { Appointment, CreateAppointmentDto, AppointmentStatus } from '@/utils/appointmentsApi';
import { petsApi } from '@/utils/petsApi';
import type { Pet } from '@/utils/petsApi';
import { vetsApi } from '@/utils/vetsApi';
import type { Vet } from '@/utils/vetsApi';
import { AppointmentCard } from './components';
import AppointmentForm from './components/AppointmentForm';
import { FormModal } from '@/components/Modal';
import { ConfirmModal } from '@/components/Modal';
import { getErrorMessage } from '@/utils/errorMessages';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formAppointment, setFormAppointment] = useState<Partial<CreateAppointmentDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort states
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'date_asc' | 'status'>('date_desc');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterPetId, setFilterPetId] = useState<string>('');

  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    if (user) {
      loadPets();
      loadVets();
      loadAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Apply filters and sorting on the frontend
  useEffect(() => {
    applyFiltersAndSort();
  }, [allAppointments, sortOrder, filterDate, filterPetId, pets]);

  const loadPets = async () => {
    try {
      const data = await petsApi.getPets();
      setPets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      // Silently fail - pets filter is optional
    }
  };

  const loadVets = async () => {
    try {
      const data = await vetsApi.getVets();
      setVets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load vets:', err);
    }
  };

  const loadAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Load all appointments without filters
      const data = await appointmentsApi.getAppointments();
      const appointmentsList = Array.isArray(data) ? data : [];
      
      setAllAppointments(appointmentsList);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setAllAppointments([]);
        setError(null);
      } else {
        const errorMessage = getErrorMessage(err, 'appointments', 'load');
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allAppointments];

    // Filter by pet
    if (filterPetId) {
      const selectedPet = pets.find(p => String(p.id) === filterPetId);
      if (selectedPet) {
        filtered = filtered.filter(a => a.petName === selectedPet.name);
      }
    }

    // Filter by date
    if (filterDate) {
      const filterDateStr = filterDate;
      filtered = filtered.filter(a => {
        const appointmentDate = new Date(a.date);
        const filterDateObj = new Date(filterDateStr);
        return (
          appointmentDate.getFullYear() === filterDateObj.getFullYear() &&
          appointmentDate.getMonth() === filterDateObj.getMonth() &&
          appointmentDate.getDate() === filterDateObj.getDate()
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortOrder === 'date_desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === 'date_asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOrder === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    setAppointments(filtered);
  };

  const handleAddClick = () => {
    if (!user) {
      setError('Please log in to schedule an appointment');
      return;
    }
    setFormAppointment({
      date: '',
      description: '',
      petId: '',
      vetId: '',
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (appointment: Appointment) => {
    if (!isAdmin) return;
    setSelectedAppointment(appointment);
    // Find the pet and vet IDs from the appointment
    const pet = pets.find(p => p.name === appointment.petName);
    const vet = vets.find(v => v.fullName === appointment.vetName);
    setFormAppointment({
      date: appointment.date,
      description: appointment.description,
      petId: pet ? String(pet.id) : '',
      vetId: vet ? vet.id : '',
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleStatusUpdate = async (appointment: Appointment, status: AppointmentStatus) => {
    if (!isAdmin) return;

    setIsSubmitting(true);
    try {
      await appointmentsApi.updateStatus(appointment.id, status);
      const updatedAll = allAppointments.map((a) => 
        a.id === appointment.id ? { ...a, status } : a
      );
      setAllAppointments(updatedAll);
      setSuccessMessage(`Appointment status updated to ${status}`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'appointments', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = useCallback((field: keyof CreateAppointmentDto, value: any) => {
    setFormAppointment((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const appointmentData: CreateAppointmentDto = {
        date: formAppointment.date || new Date().toISOString(),
        description: formAppointment.description || '',
        petId: formAppointment.petId || '',
        vetId: formAppointment.vetId || '',
      };

      if (!appointmentData.petId || !appointmentData.vetId) {
        setError('Please select both a pet and a veterinarian');
        setIsSubmitting(false);
        return;
      }

      const newAppointment = await appointmentsApi.createAppointment(appointmentData);
      setAllAppointments([...allAppointments, newAppointment]);
      setIsAddModalOpen(false);
      setFormAppointment({});
      setSuccessMessage('Appointment scheduled successfully!');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'appointments', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedAppointment?.id || !isAdmin) return;

    setIsSubmitting(true);
    try {
      const appointmentData: CreateAppointmentDto = {
        date: formAppointment.date || selectedAppointment.date,
        description: formAppointment.description || selectedAppointment.description,
        petId: formAppointment.petId || '',
        vetId: formAppointment.vetId || '',
      };

      if (!appointmentData.petId || !appointmentData.vetId) {
        setError('Please select both a pet and a veterinarian');
        setIsSubmitting(false);
        return;
      }

      // Note: This assumes there's an update endpoint. If not, you may need to delete and recreate
      // For now, we'll reload appointments to get updated data
      await loadAppointments();
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
      setFormAppointment({});
      setSuccessMessage('Appointment updated successfully!');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'appointments', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAppointment?.id || !isAdmin) return;

    setIsSubmitting(true);
    try {
      await appointmentsApi.deleteAppointment(selectedAppointment.id);
      setAllAppointments(allAppointments.filter((a) => a.id !== selectedAppointment.id));
      setIsDeleteModalOpen(false);
      setSelectedAppointment(null);
      setSuccessMessage('Appointment deleted successfully.');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'appointments', 'delete');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  const handleSortChange = (event: any) => {
    setSortOrder(event.target.value);
  };

  const handleFilterDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(event.target.value);
  };

  const handleFilterPetChange = (event: any) => {
    setFilterPetId(event.target.value);
  };

  const clearFilters = () => {
    setSortOrder('date_desc');
    setFilterDate('');
    setFilterPetId('');
  };

  if (!user) {
    return (
      <Container maxWidth="lg" className="container-py-4">
        <Alert severity="info">Please log in to view your appointments.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="container-py-4">
      <Box className="pets-page-header">
        <Box className="pets-page-header-left">
          <EventIcon className="pets-page-icon" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" className="pets-page-title">
              Appointments
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your veterinary appointments
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Schedule Appointment
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="date_desc">Date (Newest First)</MenuItem>
            <MenuItem value="date_asc">Date (Oldest First)</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Pet</InputLabel>
          <Select
            value={filterPetId}
            label="Filter by Pet"
            onChange={handleFilterPetChange}
          >
            <MenuItem value="">All Pets</MenuItem>
            {pets.map((pet) => (
              <MenuItem key={pet.id} value={String(pet.id)}>
                {pet.name} ({pet.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Filter by Date"
          size="small"
          value={filterDate}
          onChange={handleFilterDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ 
            minWidth: 200,
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
        {(filterDate || filterPetId || sortOrder !== 'date_desc') && (
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {loading ? (
        <Box className="display-flex justify-content-center py-8">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      ) : appointments.length === 0 ? (
        <Box className="pets-empty-state">
          <EventIcon className="pets-empty-icon" sx={{ fontSize: 64 }} />
          {filterDate || filterPetId ? (
            <>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 2, mt: 2 }}>
                No appointments match your filters
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                Try adjusting your filters or clear them to see all appointments.
              </Typography>
              <Button variant="contained" onClick={clearFilters}>
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 2, mt: 2 }}>
                No appointments found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                Start by scheduling your first appointment!
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
                Schedule Your First Appointment
              </Button>
            </>
          )}
        </Box>
      ) : (
        <Box className="pets-grid">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={isAdmin ? handleEditClick : undefined}
              onDelete={isAdmin ? handleDeleteClick : undefined}
              onStatusUpdate={isAdmin ? handleStatusUpdate : undefined}
              canEdit={isAdmin}
            />
          ))}
        </Box>
      )}

      {/* Add Appointment Modal */}
      <FormModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormAppointment({});
        }}
        onSubmit={handleAddSubmit}
        title="Schedule New Appointment"
        submitText="Schedule Appointment"
        loading={isSubmitting}
      >
        <AppointmentForm
          appointment={formAppointment}
          onChange={handleFormChange}
        />
      </FormModal>

      {/* Edit Appointment Modal */}
      {isAdmin && (
        <FormModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAppointment(null);
            setFormAppointment({});
          }}
          onSubmit={handleEditSubmit}
          title="Edit Appointment"
          submitText="Save Changes"
          loading={isSubmitting}
        >
          <AppointmentForm
            appointment={formAppointment}
            onChange={handleFormChange}
            vetId={selectedAppointment ? formAppointment.vetId : undefined}
          />
        </FormModal>
      )}

      {/* Delete Confirmation Modal */}
      {isAdmin && (
        <ConfirmModal
          open={isDeleteModalOpen}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedAppointment(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Appointment"
          message={`Are you sure you want to delete this appointment? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          loading={isSubmitting}
        />
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Appointments;
