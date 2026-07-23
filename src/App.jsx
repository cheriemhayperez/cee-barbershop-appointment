import { Suspense, useEffect } from 'react';

import AppRoutes from '@/routes/index';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { CBLoaderBackdrop } from '@/components';
import { appName } from '@/constants/app.config';

export default function App() {
  useEffect(() => {
    document.title = appName;
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<CBLoaderBackdrop label="Loading page" />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}
