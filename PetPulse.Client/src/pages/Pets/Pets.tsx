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
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '@/context/AuthContext';
import { petsApi } from '@/utils/petsApi';
import type { Pet } from '@/utils/petsApi';
import { PetCard, PetForm } from './components';
import { FormModal } from '@/components/Modal';
import { ConfirmModal } from '@/components/Modal';
import { decodeJWT } from '@/utils/jwt';
import { getErrorMessage } from '@/utils/errorMessages';
import './Pets.css';

const Pets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [formPet, setFormPet] = useState<Partial<Pet>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load pets on mount
  useEffect(() => {
    if (user) {
      loadPets();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await petsApi.getPets();
      // Backend should filter by token, but we'll use all returned pets
      const userPets = Array.isArray(data) ? data : [];
      setPets(userPets);
      setError(null); // Clear any previous errors on success
    } catch (err: any) {
      
      // If it's a 404, treat as no pets found
      if (err.response?.status === 404) {
        setPets([]);
        setError(null);
      } else {
        const errorMessage = getErrorMessage(err, 'pets', 'load');
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (!user) {
      setError('Please log in to add pets');
      return;
    }
    const userId: string = user.id;
    setFormPet({
      name: '',
      type: '',
      age: 0,
      ownerId: userId,
    });
    setIsAddModalOpen(true);
  };


  const handleFormChange = (field: keyof Pet, value: any) => {
    setFormPet((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async () => {
    if (!user) return;
    
    const userId: string = user.id;
    setIsSubmitting(true);
    try {
      const petData: Omit<Pet, 'id' | 'ownerName'> = {
        name: formPet.name || '',
        type: formPet.type || '',
        age: formPet.age || 0,
        ownerId: userId,
      };
      const newPet = await petsApi.createPet(petData);

      setPets([...pets, newPet]);
      setIsAddModalOpen(false);
      setSuccessMessage(`${newPet.name} has been added successfully!`);
      setFormPet({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedPet?.id) return;

    setIsSubmitting(true);
    try {
      await petsApi.updatePet(selectedPet.id, formPet);
      // Since backend returns NoContent, construct updated pet from form data
      const updatedPet: Pet = {
        ...selectedPet,
        ...formPet,
        id: selectedPet.id, // Ensure ID is preserved
        ownerName: selectedPet.ownerName, // Preserve ownerName
      };
      setPets(pets.map((p) => (p.id === selectedPet.id ? updatedPet : p)));
      setIsEditModalOpen(false);
      setSelectedPet(null);
      setSuccessMessage(`${updatedPet.name} has been updated successfully!`);
      setFormPet({});
      
      // Decode JWT token
      const token = localStorage.getItem('token');
      if (token) {
        decodeJWT(token);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPet?.id) return;

    setIsSubmitting(true);
    try {
      await petsApi.deletePet(selectedPet.id);
      setPets(pets.filter((p) => p.id !== selectedPet.id));
      setIsDeleteModalOpen(false);
      setSelectedPet(null);
      setSuccessMessage(`${selectedPet.name} has been removed successfully.`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'delete');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  if (!user) {
    return (
      <Container maxWidth="lg" className="container-py-4">
        <Alert severity="info">Please log in to view your pets.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="container-py-4">
      <Box className="pets-page-header">
        <Box className="pets-page-header-left">
          <PetsIcon className="pets-page-icon" />
          <Box>
            <Typography variant="h4" component="h1" className="pets-page-title">
              My Pets
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your pet companions
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Pet
        </Button>
      </Box>

      {loading ? (
        <Box className="display-flex justify-content-center py-8">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      ) : pets.length === 0 ? (
        <Box className="pets-empty-state">
          <PetsIcon className="pets-empty-icon" />
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2, mt: 2 }}>
            No pets yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Start by adding your first pet companion!
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Your First Pet
          </Button>
        </Box>
      ) : (
        <Box className="pets-grid">
          {pets.map((pet) => (
            <PetCard
              key={pet.id || Math.random()}
              pet={pet}
            />
          ))}
        </Box>
      )}

      {/* Add Pet Modal */}
      <FormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Add New Pet"
        submitText="Add Pet"
        loading={isSubmitting}
      >
        <Box sx={{ mt: 2 }}>
          <PetForm pet={formPet} onChange={handleFormChange} />
        </Box>
      </FormModal>

      {/* Edit Pet Modal */}
      <FormModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPet(null);
          setFormPet({});
        }}
        onSubmit={handleEditSubmit}
        title="Edit Pet"
        submitText="Save Changes"
        loading={isSubmitting}
      >
        <Box sx={{ mt: 2 }}>
          <PetForm pet={formPet} onChange={handleFormChange} />
        </Box>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedPet(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Pet"
        message={`Are you sure you want to delete ${selectedPet?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={isSubmitting}
      />

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

export default Pets;
