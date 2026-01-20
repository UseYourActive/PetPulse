import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useAuth } from '@/context/AuthContext';
import { vetsApi } from '@/utils/vetsApi';
import { appointmentsApi } from '@/utils/appointmentsApi';
import type { Vet, CreateVetDto } from '@/utils/vetsApi';
import type { CreateAppointmentDto } from '@/utils/appointmentsApi';
import { VetCard, VetForm } from './components';
import AppointmentForm from './components/AppointmentForm';
import { FormModal } from '@/components/Modal';
import { ConfirmModal } from '@/components/Modal';
import { getErrorMessage } from '@/utils/errorMessages';
import './Vets.css';

const Vets = () => {
  const { user } = useAuth();
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [formVet, setFormVet] = useState<Partial<CreateVetDto>>({});
  const [formAppointment, setFormAppointment] = useState<Partial<CreateAppointmentDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'Admin';

  // Load vets on mount
  useEffect(() => {
    loadVets();
  }, []);

  const loadVets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vetsApi.getVets();
      const vetsList = Array.isArray(data) ? data : [];
      setVets(vetsList);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setVets([]);
        setError(null);
      } else {
        const errorMessage = getErrorMessage(err, 'vets', 'load');
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (!isAdmin) {
      setError('Only administrators can add veterinarians');
      return;
    }
    setFormVet({
      firstName: '',
      lastName: '',
      yearsOfExperience: 0,
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (vet: Vet) => {
    if (!isAdmin) return;
    
    // Parse fullName to firstName and lastName
    const nameParts = vet.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormVet({
      firstName,
      lastName,
      yearsOfExperience: 0,
    });
    setSelectedVet(vet);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (vet: Vet) => {
    if (!isAdmin) return;
    setSelectedVet(vet);
    setIsDeleteModalOpen(true);
  };

  const handleAppointmentClick = (vet: Vet) => {
    if (!user) {
      setError('Please log in to schedule an appointment');
      return;
    }
    setSelectedVet(vet);
    setFormAppointment({
      date: '',
      description: '',
      petId: '',
      vetId: vet.id,
    });
    setIsAppointmentModalOpen(true);
  };

  const handleFormChange = (field: keyof CreateVetDto, value: any) => {
    setFormVet((prev) => ({ ...prev, [field]: value }));
  };

  const handleAppointmentFormChange = (field: keyof CreateAppointmentDto, value: any) => {
    setFormAppointment((prev) => ({ ...prev, [field]: value }));
  };

  const handleAppointmentSubmit = async () => {
    if (!selectedVet?.id || !user) return;

    setIsSubmitting(true);
    try {
      const appointmentData: CreateAppointmentDto = {
        date: formAppointment.date || new Date().toISOString(),
        description: formAppointment.description || '',
        petId: formAppointment.petId || '',
        vetId: selectedVet.id,
      };

      if (!appointmentData.petId) {
        setError('Please select a pet');
        setIsSubmitting(false);
        return;
      }

      await appointmentsApi.createAppointment(appointmentData);
      setIsAppointmentModalOpen(false);
      setSelectedVet(null);
      setFormAppointment({});
      setSuccessMessage(`Appointment scheduled successfully with ${selectedVet.fullName}!`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'appointments', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubmit = async () => {
    if (!isAdmin) return;
    
    setIsSubmitting(true);
    try {
      const vetData: CreateVetDto = {
        firstName: formVet.firstName || '',
        lastName: formVet.lastName || '',
        yearsOfExperience: formVet.yearsOfExperience || 0,
      };
      const newVet = await vetsApi.createVet(vetData);

      setVets([...vets, newVet]);
      setIsAddModalOpen(false);
      setSuccessMessage(`${newVet.fullName} has been added successfully!`);
      setFormVet({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedVet?.id || !isAdmin) return;

    setIsSubmitting(true);
    try {
      const vetData: CreateVetDto = {
        firstName: formVet.firstName || '',
        lastName: formVet.lastName || '',
        yearsOfExperience: formVet.yearsOfExperience || 0,
      };
      await vetsApi.updateVet(selectedVet.id, vetData);
      
      // Reload vets to get updated data
      await loadVets();
      
      setIsEditModalOpen(false);
      setSelectedVet(null);
      setSuccessMessage('Veterinarian has been updated successfully!');
      setFormVet({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVet?.id || !isAdmin) return;

    setIsSubmitting(true);
    try {
      await vetsApi.deleteVet(selectedVet.id);
      setVets(vets.filter((v) => v.id !== selectedVet.id));
      setIsDeleteModalOpen(false);
      setSelectedVet(null);
      setSuccessMessage(`${selectedVet.fullName} has been removed successfully.`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'delete');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  return (
    <Container maxWidth="lg" className="container-py-4 vets-page">
      <Box className="pets-page-header">
        <Box className="pets-page-header-left">
          <LocalHospitalIcon className="pets-page-icon" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" className="pets-page-title">
              Veterinarians
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Our team of veterinary professionals
            </Typography>
          </Box>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Veterinarian
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
      ) : vets.length === 0 ? (
        <Box className="pets-empty-state">
          <LocalHospitalIcon className="pets-empty-icon" sx={{ fontSize: 64 }} />
          <Typography variant="h6" color="textSecondary" className="mb-1">
            No veterinarians found
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-3">
            {isAdmin ? 'Start by adding the first veterinarian to the team!' : 'No veterinarians are currently available.'}
          </Typography>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
              Add First Veterinarian
            </Button>
          )}
        </Box>
      ) : (
        <Box className="pets-grid">
          {vets.map((vet) => (
            <VetCard
              key={vet.id}
              vet={vet}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onAppointmentClick={handleAppointmentClick}
              canEdit={isAdmin}
            />
          ))}
        </Box>
      )}

      {/* Add Vet Modal */}
      {isAdmin && (
        <>
          <FormModal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddSubmit}
            title="Add New Veterinarian"
            submitText="Add Veterinarian"
            loading={isSubmitting}
          >
            <VetForm vet={formVet} onChange={handleFormChange} />
          </FormModal>

          {/* Edit Vet Modal */}
          <FormModal
            open={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedVet(null);
              setFormVet({});
            }}
            onSubmit={handleEditSubmit}
            title="Edit Veterinarian"
            submitText="Save Changes"
            loading={isSubmitting}
          >
            <VetForm vet={formVet} onChange={handleFormChange} />
          </FormModal>

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            open={isDeleteModalOpen}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedVet(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Veterinarian"
            message={`Are you sure you want to delete ${selectedVet?.fullName}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            confirmColor="error"
            loading={isSubmitting}
          />
        </>
      )}

      {/* Appointment Modal */}
      <FormModal
        open={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setSelectedVet(null);
          setFormAppointment({});
        }}
        onSubmit={handleAppointmentSubmit}
        title={`Schedule Appointment with ${selectedVet?.fullName}`}
        submitText="Schedule Appointment"
        loading={isSubmitting}
      >
        <AppointmentForm
          appointment={formAppointment}
          onChange={handleAppointmentFormChange}
          vetId={selectedVet?.id || ''}
        />
      </FormModal>

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

export default Vets;
