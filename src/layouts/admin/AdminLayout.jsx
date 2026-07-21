import { Outlet } from 'react-router-dom';
import { IconUser } from '@/layouts/admin/adminNavIcons';
import AdminSidebar from '@/layouts/admin/AdminSidebar';
import styles from '@/layouts/admin/AdminLayout.module.css';

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.userIcon} aria-label="Admin user">
            <IconUser />
          </span>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
