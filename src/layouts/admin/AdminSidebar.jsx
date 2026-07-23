import { NavLink, Link } from 'react-router-dom';
import CBLogoMark from '@/components/CBLogoMark/CBLogoMark';
import { adminNavItems, NavIcon } from '@/layouts/admin/adminNavIcons';
import styles from '@/layouts/admin/AdminSidebar.module.css';

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link to="/admin" className={styles.brand} aria-label="CEE Barbershop admin">
        <CBLogoMark size="lg" className={styles.logoMark} alt="" />
      </Link>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Menu</p>
        <ul className={styles.navList}>
          {adminNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <span className={styles.icon} aria-hidden="true">
                  <NavIcon Icon={item.Icon} />
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <Link to="/" className={styles.viewSite}>
          View Customer Site →
        </Link>
      </div>
    </aside>
  );
}
