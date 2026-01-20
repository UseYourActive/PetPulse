import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Avatar,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Collapse,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAuth } from '@/context/AuthContext';
import { petsApi } from '@/utils/petsApi';
import { vaccinesApi } from '@/utils/vaccinesApi';
import type { Pet } from '@/utils/petsApi';
import type { Vaccine, CreateVaccineDto } from '@/utils/vaccinesApi';
import type { Appointment } from '@/utils/appointmentsApi';
import { VaccineCard, VaccineForm, AppointmentCard } from './components';
import { FormModal } from '@/components/Modal';
import { ConfirmModal } from '@/components/Modal';
import { getErrorMessage } from '@/utils/errorMessages';
import './PetDetails.css';

const getPetIcon = (petType: string) => {
  const type = petType?.toLowerCase() || 'other';
  switch (type) {
    case 'dog':
      return '🐕';
    case 'cat':
      return '🐱';
    case 'bird':
      return '🐦';
    case 'rabbit':
      return '🐰';
    case 'hamster':
      return '🐹';
    default:
      return '🐾';
  }
};

const getPetIconColor = (petType: string) => {
  const type = petType?.toLowerCase() || 'other';
  switch (type) {
    case 'dog':
      return '#8B4513';
    case 'cat':
      return '#FF6B6B';
    case 'bird':
      return '#4ECDC4';
    case 'rabbit':
      return '#FFE66D';
    case 'hamster':
      return '#FFA07A';
    default:
      return 'primary.main';
  }
};

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [vaccinesLoading, setVaccinesLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formPet, setFormPet] = useState<Partial<Pet>>({});
  const [isVaccinesExpanded, setIsVaccinesExpanded] = useState(true);
  const [isAppointmentsExpanded, setIsAppointmentsExpanded] = useState(true);

  const [isAddVaccineModalOpen, setIsAddVaccineModalOpen] = useState(false);
  const [isDeleteVaccineModalOpen, setIsDeleteVaccineModalOpen] = useState(false);
  const [isDeletePetModalOpen, setIsDeletePetModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [formVaccine, setFormVaccine] = useState<Partial<CreateVaccineDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && id) {
      loadPet();
      loadVaccines();
      loadAppointments();
    } else {
      setLoading(false);
    }
  }, [user, id]);

  const loadPet = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const petData = await petsApi.getPet(id);
      setPet(petData);
      setFormPet({ ...petData });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'load');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (pet) {
      setFormPet({ ...pet });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    if (pet) {
      setFormPet({ ...pet });
      setIsEditing(false);
    }
  };

  const handleFormChange = (field: keyof Pet, value: any) => {
    setFormPet((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePet = async () => {
    if (!pet?.id || !id) return;

    setIsSubmitting(true);
    try {
      await petsApi.updatePet(id, formPet);
      const updatedPet: Pet = {
        ...pet,
        ...formPet,
        id: pet.id,
        ownerName: pet.ownerName,
      };
      setPet(updatedPet);
      setIsEditing(false);
      setSuccessMessage(`${updatedPet.name} has been updated successfully!`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadVaccines = async () => {
    if (!id) return;

    setVaccinesLoading(true);
    try {
      const vaccinesData = await vaccinesApi.getVaccines(id);
      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        const errorMessage = getErrorMessage(err, 'pets', 'load');
        setError(errorMessage);
      } else {
        setVaccines([]);
      }
    } finally {
      setVaccinesLoading(false);
    }
  };

  const loadAppointments = async () => {
    if (!id) return;

    setAppointmentsLoading(true);
    try {
      const appointmentsData = await petsApi.getPetAppointments(id);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        const errorMessage = getErrorMessage(err, 'pets', 'load');
        setError(errorMessage);
      } else {
        setAppointments([]);
      }
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleAddVaccineClick = () => {
    if (!id) return;
    setFormVaccine({
      name: '',
      dateAdministered: '',
      expiryDate: '',
      petId: id,
    });
    setIsAddVaccineModalOpen(true);
  };

  const handleDeleteVaccineClick = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine);
    setIsDeleteVaccineModalOpen(true);
  };

  const handleVaccineFormChange = (field: keyof CreateVaccineDto, value: any) => {
    setFormVaccine((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVaccineSubmit = async () => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const vaccineData = {
        name: formVaccine.name || '',
        dateAdministered: formVaccine.dateAdministered || new Date().toISOString(),
        expiryDate: formVaccine.expiryDate || new Date().toISOString(),
        petId: id,
      };
      const newVaccine = await vaccinesApi.createVaccine(vaccineData);
      setVaccines([...vaccines, newVaccine]);
      setIsAddVaccineModalOpen(false);
      setSuccessMessage(`${newVaccine.name} vaccine has been added successfully!`);
      setFormVaccine({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVaccineConfirm = async () => {
    if (!selectedVaccine?.id) return;

    setIsSubmitting(true);
    try {
      await vaccinesApi.deleteVaccine(selectedVaccine.id);
      setVaccines(vaccines.filter((v) => v.id !== selectedVaccine.id));
      setIsDeleteVaccineModalOpen(false);
      setSelectedVaccine(null);
      setSuccessMessage(`${selectedVaccine.name} vaccine has been removed successfully.`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'delete');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePetClick = () => {
    setIsDeletePetModalOpen(true);
  };

  const handleDeletePetConfirm = async () => {
    if (!pet?.id || !id) return;

    setIsSubmitting(true);
    try {
      await petsApi.deletePet(id);
      setSuccessMessage(`${pet.name} has been removed successfully.`);
      setTimeout(() => {
        navigate('/pets');
      }, 1500);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'pets', 'delete');
      setError(errorMessage);
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
        <Alert severity="info">Please log in to view pet details.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" className="container-py-4">
        <Box className="display-flex justify-content-center py-8">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container maxWidth="lg" className="container-py-4">
        <Alert severity="error">Pet not found.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/pets')}
          sx={{ mt: 2 }}
        >
          Back to Pets
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/pets')}
          variant="text"
          sx={{
            mb: 2,
            color: 'primary.main',
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: '0.875rem',
            letterSpacing: '0.5px',
            px: 1,
            '&:hover': {
              backgroundColor: 'rgba(47, 166, 160, 0.08)',
            },
          }}
        >
          Back to Pets
        </Button>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ 
            background: `linear-gradient(135deg, ${getPetIconColor(formPet.type || pet.type)}15 0%, ${getPetIconColor(formPet.type || pet.type)}05 100%)`,
            p: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                sx={{
                  bgcolor: getPetIconColor(formPet.type || pet.type),
                  width: 120,
                  height: 120,
                  fontSize: 72,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {getPetIcon(formPet.type || pet.type)}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  {isEditing ? (
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Pet Name"
                        value={formPet.name || ''}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ maxWidth: 400 }}
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          select
                          label="Type"
                          value={formPet.type || ''}
                          onChange={(e) => handleFormChange('type', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ flex: 1, maxWidth: 200 }}
                        >
                          <MenuItem value="Dog">Dog</MenuItem>
                          <MenuItem value="Cat">Cat</MenuItem>
                          <MenuItem value="Bird">Bird</MenuItem>
                          <MenuItem value="Rabbit">Rabbit</MenuItem>
                          <MenuItem value="Hamster">Hamster</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <TextField
                          type="number"
                          label="Age (years)"
                          value={formPet.age || ''}
                          onChange={(e) => handleFormChange('age', parseInt(e.target.value) || 0)}
                          variant="outlined"
                          size="small"
                          sx={{ maxWidth: 150 }}
                          inputProps={{ min: 0, max: 50 }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                          {pet.name}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 2, fontWeight: 500 }}>
                          {pet.type}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <Box>
                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem', fontWeight: 600 }}>
                              Age
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.5 }}>
                              {pet.age} {pet.age === 1 ? 'year' : 'years'}
                            </Typography>
                          </Box>
                          {pet.ownerName && (
                            <Box>
                              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem', fontWeight: 600 }}>
                                Owner
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.5 }}>
                                {pet.ownerName}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, ml: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={handleEditClick}
                          sx={{ 
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'primary.main',
                              color: 'white',
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={handleDeletePetClick}
                          sx={{ 
                            borderColor: 'error.main',
                            color: 'error.main',
                            '&:hover': {
                              borderColor: 'error.dark',
                              backgroundColor: 'error.main',
                              color: 'white',
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
                {isEditing && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSavePet}
                      disabled={isSubmitting}
                      sx={{ minWidth: 140 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <Box sx={{ 
            p: 3,
            borderBottom: isVaccinesExpanded ? '1px solid' : 'none',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(47, 166, 160, 0.05) 0%, rgba(47, 166, 160, 0.02) 100%)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                <IconButton
                  onClick={() => setIsVaccinesExpanded(!isVaccinesExpanded)}
                  sx={{
                    color: 'primary.main',
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(47, 166, 160, 0.1)',
                    },
                  }}
                >
                  {isVaccinesExpanded ? (
                    <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
                  ) : (
                    <KeyboardArrowRightIcon sx={{ fontSize: 28 }} />
                  )}
                </IconButton>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <VaccinesIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Vaccines
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                    Track vaccination records and expiry dates
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddVaccineClick}
                sx={{
                  boxShadow: '0 2px 8px rgba(47, 166, 160, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(47, 166, 160, 0.4)',
                  },
                }}
              >
                Add Vaccine
              </Button>
            </Box>
          </Box>

          <Collapse in={isVaccinesExpanded}>
            <Box sx={{ p: 3 }}>
              {vaccinesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : vaccines.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 8,
                  px: 3,
                  textAlign: 'center',
                }}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: '50%', 
                    bgcolor: 'grey.100', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <VaccinesIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
                    No vaccines recorded
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400 }}>
                    Start by adding the first vaccine record for {pet.name}!
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={handleAddVaccineClick}
                    sx={{
                      boxShadow: '0 2px 8px rgba(47, 166, 160, 0.3)',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(47, 166, 160, 0.4)',
                      },
                    }}
                  >
                    Add First Vaccine
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                  {vaccines.map((vaccine) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vaccine.id}>
                      <VaccineCard vaccine={vaccine} onDelete={handleDeleteVaccineClick} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Collapse>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            mt: 3,
          }}
        >
          <Box sx={{ 
            p: 3,
            borderBottom: isAppointmentsExpanded ? '1px solid' : 'none',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(47, 166, 160, 0.05) 0%, rgba(47, 166, 160, 0.02) 100%)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                <IconButton
                  onClick={() => setIsAppointmentsExpanded(!isAppointmentsExpanded)}
                  sx={{
                    color: 'primary.main',
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(47, 166, 160, 0.1)',
                    },
                  }}
                >
                  {isAppointmentsExpanded ? (
                    <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
                  ) : (
                    <KeyboardArrowRightIcon sx={{ fontSize: 28 }} />
                  )}
                </IconButton>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <EventIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Appointments
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                    View appointment history and scheduled visits
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Collapse in={isAppointmentsExpanded}>
            <Box sx={{ p: 3 }}>
              {appointmentsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : appointments.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 8,
                  px: 3,
                  textAlign: 'center',
                }}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: '50%', 
                    bgcolor: 'grey.100', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <EventIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
                    No appointments recorded
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400 }}>
                    {pet.name} doesn't have any appointments yet.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                  {appointments.map((appointment) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={appointment.id}>
                      <AppointmentCard appointment={appointment} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Collapse>
        </Paper>

      {/* Add Vaccine Modal */}
      <FormModal
        open={isAddVaccineModalOpen}
        onClose={() => {
          setIsAddVaccineModalOpen(false);
          setFormVaccine({});
        }}
        onSubmit={handleAddVaccineSubmit}
        title="Add New Vaccine"
        submitText="Add Vaccine"
        loading={isSubmitting}
      >
        <Box sx={{ mt: 2 }}>
          <VaccineForm vaccine={formVaccine} onChange={handleVaccineFormChange} />
        </Box>
      </FormModal>

      {/* Delete Vaccine Confirmation Modal */}
      <ConfirmModal
        open={isDeleteVaccineModalOpen}
        onCancel={() => {
          setIsDeleteVaccineModalOpen(false);
          setSelectedVaccine(null);
        }}
        onConfirm={handleDeleteVaccineConfirm}
        title="Delete Vaccine"
        message={`Are you sure you want to delete ${selectedVaccine?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={isSubmitting}
      />

      {/* Delete Pet Confirmation Modal */}
      <ConfirmModal
        open={isDeletePetModalOpen}
        onCancel={() => {
          setIsDeletePetModalOpen(false);
        }}
        onConfirm={handleDeletePetConfirm}
        title="Delete Pet"
        message={`Are you sure you want to delete ${pet?.name}? This action cannot be undone and will also remove all associated vaccine records.`}
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
    </Box>
  );
};

export default PetDetails;
