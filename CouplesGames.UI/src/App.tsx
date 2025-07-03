import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <AppRoutes />
      <LoadingOverlay />
    </LoadingProvider>
  </QueryClientProvider>
);

export default App;