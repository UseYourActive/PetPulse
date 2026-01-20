import { AppBar, Toolbar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import logoImage from '@/assets/image.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="header">
      <Toolbar className="header__toolbar">
        <Box
          className="header__logo"
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            py: 0.5,
          }}
        >
          <img 
            src={logoImage} 
            alt="PetPulse" 
            style={{
              height: '60px',
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '200px',
            }}
          />
        </Box>

        <Navigation />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
