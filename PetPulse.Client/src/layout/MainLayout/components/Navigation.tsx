import { Box, Button, IconButton, Typography, Avatar, Chip, Tooltip } from '@mui/material';
import { Login, AppRegistration, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name?: string) => {
    if (!name) return '#2FA6A0';
    const colors = [
      '#2FA6A0', '#3DB8B2', '#1F8A85', '#4CAF50', '#2196F3',
      '#9C27B0', '#F44336', '#FF9800', '#795548', '#607D8B'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box className="nav">
      {/* Main Navigation Menu */}
      <Box className="nav__menu">
        {user?.role === 'Admin' && (
          <Button
            color="inherit"
            className="nav__button"
            onClick={() => navigate('/owners')}
          >
            Owners
          </Button>
        )}
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
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mr: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: getAvatarColor(user?.username),
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {getInitials(user?.username)}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    lineHeight: 1.2,
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  {user?.username}
                </Typography>
                {user?.role === 'Admin' && (
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(255, 193, 7, 0.9)',
                      color: '#000',
                      display: { xs: 'none', md: 'flex' }
                    }}
                  />
                )}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: { xs: 'block', md: 'none' }
                }}
              >
                {user?.username}
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                className="nav__auth-button"
                onClick={handleLogout}
                size="large"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
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
