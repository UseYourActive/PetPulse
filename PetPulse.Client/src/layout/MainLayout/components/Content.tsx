import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Content = () => {
  return (
    <Container className="content">
      <div className="content__container">
        <Outlet />
      </div>
    </Container>
  );
};

export default Content;
