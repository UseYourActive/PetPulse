import { Box, Button, IconButton, Typography } from '@mui/material';
import { Login, AppRegistration, Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box className="nav">
      {/* Main Navigation Menu */}
      <Box className="nav__menu">
        <Button
          color="inherit"
          className="nav__button"
          onClick={() => navigate('/owners')}
        >
          Owners
        </Button>
        <Button
          color="inherit"
          className="nav__button"
          onClick={() => navigate('/pets')}
        >
          Pets
        </Button>
        <Button
          color="inherit"
          className="nav__button"
          onClick={() => navigate('/vets')}
        >
          Vets
        </Button>
        <Button
          color="inherit"
          className="nav__button"
          onClick={() => navigate('/appointments')}
        >
          Appointments
        </Button>
      </Box>

      {/* Auth buttons */}
      <Box className="nav__auth">
        {isLoggedIn ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
              <Person />
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.userName}
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              className="nav__auth-button"
              onClick={handleLogout}
              title="Logout"
              size="large"
            >
              <Logout />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              className="nav__auth-button"
              onClick={() => navigate('/auth/login')}
              title="Login"
              size="large"
            >
              <Login />
            </IconButton>
            <IconButton
              color="inherit"
              className="nav__auth-button"
              onClick={() => navigate('/auth/register')}
              title="Register"
              size="large"
            >
              <AppRegistration />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navigation;
