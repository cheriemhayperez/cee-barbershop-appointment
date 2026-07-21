import { Outlet } from 'react-router-dom';
import Header from '@/layouts/customer/Header';
import Footer from '@/layouts/customer/Footer';
import styles from '@/layouts/customer/CustomerLayout.module.css';

export default function CustomerLayout() {
  return (
    <div className={styles.layout}>
      <Header variant="customer" />
      <Outlet />
      <Footer variant="customer" />
    </div>
  );
}
