import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { theme } from './theme/theme';
import './styles/main.css';
import MainLayout from './layout/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Owners from './pages/Owners/Owners';
import Pets from './pages/Pets/Pets';
import Vets from './pages/Vets/Vets';
import Appointments from './pages/Appointments/Appointments';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* The Layout route wraps the others. Note the closing tag is at the bottom. */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path='auth'>
                <Route path='login' element={ <Login />} /> 
                <Route path='register' element={ <Register />} /> 
              </Route>
              <Route path="owners" element={<Owners />} />
              <Route path="pets" element={<Pets />} />
              <Route path="vets" element={<Vets />} />
              <Route path="appointments" element={<Appointments />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
