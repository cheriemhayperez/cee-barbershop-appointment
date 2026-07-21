import { Suspense, useEffect } from 'react';

import AppRoutes from '@/routes/index';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { appName } from '@/constants/app.config';

function RouteFallback() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        color: '#666',
        fontSize: '0.875rem',
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.title = appName;
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}
