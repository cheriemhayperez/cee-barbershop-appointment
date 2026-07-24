import { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AdminPageHeader, CBLoader } from '@/components';
import styles from '@/pages/admin/Settings/AdminSettingsLayout.module.css';

const tabs = [
  { to: '/admin/settings', label: 'General', end: true },
  { to: '/admin/settings/schedule', label: 'Booking Schedule', end: false },
];

function SettingsTabFallback() {
  return (
    <div className={styles.tabFallback} aria-live="polite">
      <CBLoader size="md" label="Loading settings" />
    </div>
  );
}

export default function AdminSettingsLayout() {
  const location = useLocation();

  return (
    <div className={styles.page}>
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

      <Suspense fallback={<SettingsTabFallback />}>
        <Outlet key={location.pathname} />
      </Suspense>
    </div>
  );
}
