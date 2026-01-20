import { Box } from '@mui/material';
import Header from './components/Header';
import Content from './components/Content';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <Box className="main-layout">
      <Header />
      <Content />
    </Box>
  );
};

export default MainLayout;
