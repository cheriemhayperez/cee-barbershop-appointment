import { NavLink, Outlet } from 'react-router-dom';
import { AdminPageHeader } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import styles from '@/pages/admin/Settings/AdminSettingsLayout.module.css';

const tabs = [
  { to: '/admin/settings', label: 'General', end: true },
  { to: '/admin/settings/schedule', label: 'Booking Schedule', end: false },
];

export default function AdminSettingsLayout() {
  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader
        title="Settings"
        subtitle="Shop configuration and booking maintenance."
      />

      <nav className={styles.tabs} aria-label="Settings sections">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </PageTransition>
  );
}
