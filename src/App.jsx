import { useEffect } from 'react';

import AppRoutes from '@/routes/index';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { appName } from '@/constants/app.config';

export default function App() {
  useEffect(() => {
    document.title = appName;
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
