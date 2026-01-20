import { createTheme } from '@mui/material/styles';

const primaryColor = '#2FA6A0'; // Teal - modern, medical, neutral emotionally
const gradientStart = '#2FA6A0';
const gradientMid = '#3DB8B2';
const gradientEnd = '#1F8A85';

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: '#52B7B1',
      dark: '#247973',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1F4E79', // Deep Blue for accents
      light: '#4A7DB3',
      dark: '#153955',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h5: {
      fontWeight: 700,
      background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientMid} 50%, ${gradientEnd} 100%)`,
          boxShadow: '0 4px 20px rgba(47, 166, 160, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientMid} 50%, ${gradientEnd} 100%)`,
          boxShadow: '0 4px 15px rgba(47, 166, 160, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${gradientEnd} 0%, ${gradientMid} 50%, ${gradientStart} 100%)`,
            boxShadow: '0 6px 20px rgba(47, 166, 160, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: primaryColor,
          color: primaryColor,
          borderWidth: '2px',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: `linear-gradient(135deg, rgba(47, 166, 160, 0.1) 0%, rgba(61, 184, 178, 0.1) 100%)`,
            borderColor: gradientEnd,
            borderWidth: '2px',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(47, 166, 160, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input[type="date"]::-webkit-calendar-picker-indicator': {
            cursor: 'pointer',
            filter: 'invert(47%) sepia(89%) saturate(1200%) hue-rotate(150deg) brightness(95%) contrast(85%)',
            opacity: 0.8,
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 1,
            },
          },
        },
      },
    },
  },
});
