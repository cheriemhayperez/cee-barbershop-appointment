import { Outlet } from 'react-router-dom';
import Header from '@/layouts/customer/Header';
import Footer from '@/layouts/customer/Footer';
import { useScrollToTopOnNavigate } from '@/hooks/customer/layout';
import styles from '@/layouts/customer/CustomerLayout.module.css';

export default function CustomerLayout() {
  useScrollToTopOnNavigate();

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
