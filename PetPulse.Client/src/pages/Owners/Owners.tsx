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
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '@/context/AuthContext';
import { ownersApi } from '@/utils/ownersApi';
import type { Owner, CreateOwnerDto } from '@/utils/ownersApi';
import { OwnerCard, OwnerForm } from './components';
import { FormModal } from '@/components/Modal';
import { ConfirmModal } from '@/components/Modal';
import { getErrorMessage } from '@/utils/errorMessages';
import './Owners.css';

const Owners = () => {
  const { user } = useAuth();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [formOwner, setFormOwner] = useState<Partial<Owner>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load owners on mount
  useEffect(() => {
    if (user) {
      loadOwners();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOwners = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await ownersApi.getOwners();
      const ownersList = Array.isArray(data) ? data : [];
      setOwners(ownersList);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setOwners([]);
        setError(null);
      } else {
        const errorMessage = getErrorMessage(err, 'owners', 'load');
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (!user) {
      setError('Please log in to add owners');
      return;
    }
    setFormOwner({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (owner: Owner) => {
    setFormOwner({ ...owner });
    setSelectedOwner(owner);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (field: keyof Owner, value: any) => {
    setFormOwner((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const ownerData: CreateOwnerDto = {
        firstName: formOwner.firstName || '',
        lastName: formOwner.lastName || '',
        email: formOwner.email || '',
        phoneNumber: formOwner.phoneNumber || '',
      };
      const newOwner = await ownersApi.createOwner(ownerData);

      setOwners([...owners, newOwner]);
      setIsAddModalOpen(false);
      setSuccessMessage(`${newOwner.firstName} ${newOwner.lastName} has been added successfully!`);
      setFormOwner({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'owners', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedOwner?.id) return;

    setIsSubmitting(true);
    try {
      const ownerData: CreateOwnerDto = {
        firstName: formOwner.firstName || '',
        lastName: formOwner.lastName || '',
        email: formOwner.email || '',
        phoneNumber: formOwner.phoneNumber || '',
      };
      await ownersApi.updateOwner(selectedOwner.id, ownerData);
      
      const updatedOwner: Owner = {
        ...selectedOwner,
        ...formOwner,
        id: selectedOwner.id,
      };
      setOwners(owners.map((o) => (o.id === selectedOwner.id ? updatedOwner : o)));
      setIsEditModalOpen(false);
      setSelectedOwner(null);
      setSuccessMessage(`${updatedOwner.firstName} ${updatedOwner.lastName} has been updated successfully!`);
      setFormOwner({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'owners', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOwner?.id) return;

    setIsSubmitting(true);
    try {
      await ownersApi.deleteOwner(selectedOwner.id);
      setOwners(owners.filter((o) => o.id !== selectedOwner.id));
      setIsDeleteModalOpen(false);
      setSelectedOwner(null);
      setSuccessMessage(`${selectedOwner.firstName} ${selectedOwner.lastName} has been removed successfully.`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'owners', 'delete');
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
        <Alert severity="info">Please log in to view owners.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="container-py-4">
      <Box className="pets-page-header">
        <Box className="pets-page-header-left">
          <PersonIcon className="pets-page-icon" />
          <Box>
            <Typography variant="h4" component="h1" className="pets-page-title">
              Owners
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage pet owners
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Owner
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
      ) : owners.length === 0 ? (
        <Box className="pets-empty-state">
          <PersonIcon className="pets-empty-icon" />
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2, mt: 2 }}>
            No owners yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Start by adding your first owner!
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Your First Owner
          </Button>
        </Box>
      ) : (
        <Box className="pets-grid">
          {owners.map((owner) => (
            <OwnerCard
              key={owner.id}
              owner={owner}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}

      {/* Add Owner Modal */}
      <FormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Add New Owner"
        submitText="Add Owner"
        loading={isSubmitting}
      >
        <Box sx={{ mt: 2 }}>
          <OwnerForm owner={formOwner} onChange={handleFormChange} />
        </Box>
      </FormModal>

      {/* Edit Owner Modal */}
      <FormModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOwner(null);
          setFormOwner({});
        }}
        onSubmit={handleEditSubmit}
        title="Edit Owner"
        submitText="Save Changes"
        loading={isSubmitting}
      >
        <OwnerForm owner={formOwner} onChange={handleFormChange} />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedOwner(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Owner"
        message={`Are you sure you want to delete ${selectedOwner?.firstName} ${selectedOwner?.lastName}? This action cannot be undone.`}
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

export default Owners;