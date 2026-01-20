import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="header">
      <Toolbar className="header__toolbar">
        <Typography
          variant="h6"
          className="header__logo"
          onClick={() => navigate('/')}
        >
          🐾 PetPulse
        </Typography>

        <Navigation />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
