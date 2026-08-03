import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/layouts/customer/Header';
import Footer from '@/layouts/customer/Footer';
import { CBLoader } from '@/components';
import { useScrollToTopOnNavigate } from '@/hooks/customer';
import styles from '@/layouts/customer/CustomerLayout.module.css';

function CustomerRouteFallback() {
  return (
    <div className={styles.routeFallback} aria-live="polite">
      <CBLoader size="md" label="Loading page" />
    </div>
  );
}

export default function CustomerLayout() {
  useScrollToTopOnNavigate();

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Suspense fallback={<CustomerRouteFallback />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
