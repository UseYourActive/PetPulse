import { createTheme } from '@mui/material/styles';

const primaryColor = '#2FA6A0'; // Teal - modern, medical, neutral emotionally

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
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: primaryColor,
    },
    h5: {
      fontWeight: 600,
      color: primaryColor,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: primaryColor,
          boxShadow: '0 2px 8px rgba(47, 166, 160, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: primaryColor,
          '&:hover': {
            backgroundColor: '#247973',
          },
        },
        outlined: {
          borderColor: primaryColor,
          color: primaryColor,
          '&:hover': {
            backgroundColor: 'rgba(47, 166, 160, 0.08)',
            borderColor: '#247973',
          },
        },
      },
    },
  },
});
