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
  Rating,
  IconButton,
  Collapse,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAuth } from '@/context/AuthContext';
import { vetsApi } from '@/utils/vetsApi';
import { reviewsApi } from '@/utils/reviewsApi';
import type { Vet, CreateVetDto } from '@/utils/vetsApi';
import type { Review, CreateReviewDto } from '@/utils/reviewsApi';
import { ReviewCard, ReviewForm } from './components';
import { FormModal } from '@/components/Modal';
import { ConfirmModal } from '@/components/Modal';
import { getErrorMessage } from '@/utils/errorMessages';
import './VetDetails.css';

const VetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vet, setVet] = useState<Vet | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formVet, setFormVet] = useState<Partial<CreateVetDto>>({});
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(true);

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = useState(false);
  const [isDeleteVetModalOpen, setIsDeleteVetModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [formReview, setFormReview] = useState<Partial<CreateReviewDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'Admin';
  const canDeleteReview = (review: Review) => {
    return isAdmin || review.userId === user?.id;
  };

  useEffect(() => {
    if (id) {
      loadVet();
      loadReviews();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadVet = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const vetData = await vetsApi.getVet(id);
      setVet(vetData);
      const nameParts = vetData.fullName.split(' ');
      setFormVet({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        yearsOfExperience: 0,
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'load');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;

    setReviewsLoading(true);
    try {
      const reviewsData = await reviewsApi.getReviews(id);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        const errorMessage = getErrorMessage(err, 'vets', 'load');
        setError(errorMessage);
      } else {
        setReviews([]);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (vet) {
      const nameParts = vet.fullName.split(' ');
      setFormVet({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        yearsOfExperience: 0,
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    if (vet) {
      const nameParts = vet.fullName.split(' ');
      setFormVet({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        yearsOfExperience: 0,
      });
      setIsEditing(false);
    }
  };

  const handleVetFormChange = (field: keyof CreateVetDto, value: any) => {
    setFormVet((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveVet = async () => {
    if (!vet?.id || !id || !isAdmin) return;

    setIsSubmitting(true);
    try {
      await vetsApi.updateVet(id, formVet as CreateVetDto);
      await loadVet();
      setIsEditing(false);
      setSuccessMessage('Veterinarian has been updated successfully!');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'update');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReviewClick = () => {
    if (!id || !user) {
      setError('Please log in to add a review');
      return;
    }
    setFormReview({
      rating: 5,
      comment: '',
      vetId: id,
    });
    setIsAddReviewModalOpen(true);
  };

  const handleDeleteReviewClick = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteReviewModalOpen(true);
  };

  const handleReviewFormChange = (field: keyof CreateReviewDto, value: any) => {
    setFormReview((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddReviewSubmit = async () => {
    if (!id || !user?.id) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        rating: formReview.rating || 5,
        comment: formReview.comment || '',
        vetId: id,
        ownerId: user.id,
      };
      const newReview = await reviewsApi.createReview(reviewData);
      setReviews([...reviews, newReview]);
      setIsAddReviewModalOpen(false);
      setSuccessMessage('Review has been added successfully!');
      setFormReview({});
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'create');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReviewConfirm = async () => {
    if (!selectedReview?.id) return;

    setIsSubmitting(true);
    try {
      await reviewsApi.deleteReview(selectedReview.id);
      setReviews(reviews.filter((r) => r.id !== selectedReview.id));
      setIsDeleteReviewModalOpen(false);
      setSelectedReview(null);
      setSuccessMessage('Review has been removed successfully.');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'delete');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVetClick = () => {
    if (!isAdmin) return;
    setIsDeleteVetModalOpen(true);
  };

  const handleDeleteVetConfirm = async () => {
    if (!vet?.id || !id || !isAdmin) return;

    setIsSubmitting(true);
    try {
      await vetsApi.deleteVet(id);
      setSuccessMessage(`${vet.fullName} has been removed successfully.`);
      setTimeout(() => {
        navigate('/vets');
      }, 1500);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'vets', 'delete');
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 4 }}>
        <Container maxWidth="lg" sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!vet) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 4 }}>
        <Container maxWidth="lg" sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
          <Alert severity="error">Veterinarian not found.</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vets')}
            sx={{ mt: 2 }}
          >
            Back to Veterinarians
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vets')}
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
          Back to Veterinarians
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
            background: 'linear-gradient(135deg, rgba(47, 166, 160, 0.15) 0%, rgba(47, 166, 160, 0.05) 100%)',
            p: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 120,
                  height: 120,
                  fontSize: 60,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <LocalHospitalIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  {isEditing ? (
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          label="First Name"
                          value={formVet.firstName || ''}
                          onChange={(e) => handleVetFormChange('firstName', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Last Name"
                          value={formVet.lastName || ''}
                          onChange={(e) => handleVetFormChange('lastName', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                          {vet.fullName}
                        </Typography>
                        {reviews.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Rating
                              value={averageRating}
                              readOnly
                              precision={0.1}
                              size="small"
                              icon={<StarIcon sx={{ fontSize: 20 }} />}
                              emptyIcon={<StarIcon sx={{ fontSize: 20, opacity: 0.3 }} />}
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: 'warning.main',
                                },
                              }}
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                              {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {isAdmin && (
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
                            onClick={handleDeleteVetClick}
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
                      )}
                    </>
                  )}
                </Box>
                {isEditing && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveVet}
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
            borderBottom: isReviewsExpanded ? '1px solid' : 'none',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(47, 166, 160, 0.05) 0%, rgba(47, 166, 160, 0.02) 100%)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                <IconButton
                  onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
                  sx={{
                    color: 'primary.main',
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(47, 166, 160, 0.1)',
                    },
                  }}
                >
                  {isReviewsExpanded ? (
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
                  <RateReviewIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Reviews
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                    Read and share experiences with this veterinarian
                  </Typography>
                </Box>
              </Box>
              {user && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddReviewClick}
                  sx={{
                    boxShadow: '0 2px 8px rgba(47, 166, 160, 0.3)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(47, 166, 160, 0.4)',
                    },
                  }}
                >
                  Add Review
                </Button>
              )}
            </Box>
          </Box>

          <Collapse in={isReviewsExpanded}>
            <Box sx={{ p: 3 }}>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : reviews.length === 0 ? (
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
                    <RateReviewIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400 }}>
                    {user ? `Be the first to review ${vet.fullName}!` : 'Please log in to add a review.'}
                  </Typography>
                  {user && (
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />} 
                      onClick={handleAddReviewClick}
                      sx={{
                        boxShadow: '0 2px 8px rgba(47, 166, 160, 0.3)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(47, 166, 160, 0.4)',
                        },
                      }}
                    >
                      Add First Review
                    </Button>
                  )}
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                  {reviews.map((review) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={review.id}>
                      <ReviewCard 
                        review={review} 
                        onDelete={handleDeleteReviewClick}
                        canDelete={canDeleteReview(review)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Collapse>
        </Paper>

        {/* Add Review Modal */}
        <FormModal
          open={isAddReviewModalOpen}
          onClose={() => {
            setIsAddReviewModalOpen(false);
            setFormReview({});
          }}
          onSubmit={handleAddReviewSubmit}
          title="Add Review"
          submitText="Submit Review"
          loading={isSubmitting}
        >
          <Box sx={{ mt: 2 }}>
            <ReviewForm review={formReview} onChange={handleReviewFormChange} />
          </Box>
        </FormModal>

        {/* Delete Review Confirmation Modal */}
        <ConfirmModal
          open={isDeleteReviewModalOpen}
          onCancel={() => {
            setIsDeleteReviewModalOpen(false);
            setSelectedReview(null);
          }}
          onConfirm={handleDeleteReviewConfirm}
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          loading={isSubmitting}
        />

        {/* Delete Vet Confirmation Modal */}
        {isAdmin && (
          <ConfirmModal
            open={isDeleteVetModalOpen}
            onCancel={() => {
              setIsDeleteVetModalOpen(false);
            }}
            onConfirm={handleDeleteVetConfirm}
            title="Delete Veterinarian"
            message={`Are you sure you want to delete ${vet?.fullName}? This action cannot be undone and will also remove all associated reviews.`}
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
    </Box>
  );
};

export default VetDetails;
