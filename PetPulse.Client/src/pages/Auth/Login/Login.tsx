import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { getErrorMessage } from '@/utils/errorMessages';
import './Login.css';

interface LoginFormData {
  userName: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  message: string;
  success: boolean;
  token?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    userName: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitTrigger, setSubmitTrigger] = useState<{
    userName: string;
    password: string;
  } | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const loginUrl = submitTrigger
    ? `${API_BASE_URL}/api/auth/login`
    : '';

  const { data, loading, error } = useFetch<LoginResponse>(
    loginUrl,
    {
      method: 'POST',
      data: submitTrigger
        ? {
            userName: submitTrigger.userName,
            password: submitTrigger.password,
          }
        : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
      skip: !submitTrigger,
    }
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target as HTMLInputElement;
    const value =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle successful login response
  useEffect(() => {
    if (data && submitTrigger) {
      // Update auth context
      login(submitTrigger.userName, submitTrigger.password).then(() => {
        setSuccessMessage('Login successful! Redirecting...');
        setFormData({
          userName: '',
          password: '',
          rememberMe: false,
        });

        // Store remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberUsername', submitTrigger.userName);
        } else {
          localStorage.removeItem('rememberUsername');
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      });

      setSubmitTrigger(null);
    }
  }, [data, submitTrigger, login, navigate, formData.rememberMe]);

  // Handle login errors
  useEffect(() => {
    if (error && submitTrigger) {
      const errorMessage = getErrorMessage(error, 'login');
      setApiError(errorMessage);
      setSubmitTrigger(null);
    }
  }, [error, submitTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setSubmitTrigger({
      userName: formData.userName,
      password: formData.password,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Load remembered username on mount
  const [mounted, setMounted] = useState(false);
  if (!mounted) {
    const rememberUsername = localStorage.getItem('rememberUsername');
    if (rememberUsername) {
      setFormData((prev) => ({
        ...prev,
        userName: rememberUsername,
        rememberMe: true,
      }));
    }
    setMounted(true);
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to your PetPulse account
            </Typography>
          </Box>

          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              error={!!errors.userName}
              helperText={errors.userName}
              margin="normal"
              required
              placeholder="Enter your username"
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              placeholder="Enter your password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    size="small"
                  />
                }
                label="Remember me"
              />
              <Link
                component="button"
                variant="body2"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement forgot password flow
                  console.log('Forgot password clicked');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{ mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/auth/register')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;