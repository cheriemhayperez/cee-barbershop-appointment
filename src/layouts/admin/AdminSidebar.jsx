import { NavLink, Link } from 'react-router-dom';
import { ArrowRight2, ExportSquare } from 'iconsax-react';
import CBLogoMark from '@/components/CBLogoMark/CBLogoMark';
import { adminNavItems, NavIcon } from '@/layouts/admin/adminNavIcons';
import { cn } from '@/utils/cn';
import styles from '@/layouts/admin/AdminSidebar.module.css';

export default function AdminSidebar({
  collapsed = false,
  isMobile = false,
  menuOpen = false,
  onToggleCollapse,
  onCloseMenu,
}) {
  const showCollapsed = !isMobile && collapsed;

  return (
    <aside
      className={cn(
        styles.sidebar,
        showCollapsed && styles.sidebarCollapsed,
        isMobile && styles.sidebarMobile,
        isMobile && menuOpen && styles.sidebarMobileOpen
      )}
    >
      <Link
        to="/admin"
        className={styles.brand}
        aria-label="CEE Barbershop admin"
        onClick={onCloseMenu}
      >
        <CBLogoMark size="header" className={styles.logoMark} alt="" />
      </Link>

      <nav className={styles.nav} aria-label="Admin navigation">
        <p className={styles.navLabel}>Menu</p>
        <ul className={styles.navList}>
          {adminNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                title={showCollapsed ? item.label : undefined}
                onClick={onCloseMenu}
                className={({ isActive }) =>
                  cn(styles.navLink, isActive && styles.active)
                }
              >
                <span className={styles.icon} aria-hidden="true">
                  <NavIcon Icon={item.Icon} />
                </span>
                <span className={styles.navText}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <Link
          to="/"
          className={styles.viewSite}
          title={showCollapsed ? 'View Customer Site' : undefined}
          onClick={onCloseMenu}
        >
          {showCollapsed ? (
            <ExportSquare size={18} color="currentColor" variant="Outline" aria-hidden="true" />
          ) : (
            <span className={styles.viewSiteText}>View Customer Site →</span>
          )}
        </Link>

        {!isMobile && (
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <ArrowRight2
              size={22}
              color="currentColor"
              variant="Outline"
              className={cn(styles.collapseIcon, !collapsed && styles.collapseIconOpen)}
            />
          </button>
        )}
      </div>
    </aside>
  );
}
