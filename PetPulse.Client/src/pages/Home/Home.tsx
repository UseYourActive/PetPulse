import { Container } from '@mui/material';
import { PageHeader, StatsGrid, UpdatesGrid, CallToAction } from './components';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import './Home.css';

export default function Home() {
  const stats = [
    { icon: <PetsIcon className="icon-size-40" />, label: 'Total Pets', value: '24' },
    { icon: <PersonIcon className="icon-size-40" />, label: 'Pet Owners', value: '18' },
    { icon: <EventIcon className="icon-size-40" />, label: 'Appointments', value: '12' },
  ];

  const recentUpdates = [
    {
      id: 1,
      title: 'Max\'s Vaccination',
      description: 'Max (Golden Retriever) has completed his annual vaccination.',
      date: '2 days ago',
      pet: 'Max',
      status: 'completed' as const,
    },
    {
      id: 2,
      title: 'Bella\'s Dental Checkup',
      description: 'Bella (Tabby Cat) has an upcoming dental checkup scheduled.',
      date: 'Jan 20, 2026',
      pet: 'Bella',
      status: 'upcoming' as const,
    },
    {
      id: 3,
      title: 'Charlie\'s Surgery Follow-up',
      description: 'Charlie (Labrador) is recovering well after surgery. Follow-up appointment recommended.',
      date: '1 week ago',
      pet: 'Charlie',
      status: 'completed' as const,
    },
  ];

  const handleViewAllPets = () => {
    console.log('Navigate to pets page');
  };

  const handleScheduleAppointment = () => {
    console.log('Navigate to schedule appointment');
  };

  return (
    <Container maxWidth="lg" className="container-py-4">
      <PageHeader
        title="Welcome to PetPulse 🏥"
        subtitle="Your trusted veterinary management system"
      />
      
      <StatsGrid stats={stats} />
      
      <UpdatesGrid updates={recentUpdates} />
      
      <CallToAction
        onPrimaryClick={handleViewAllPets}
        onSecondaryClick={handleScheduleAppointment}
      />
    </Container>
  );
}