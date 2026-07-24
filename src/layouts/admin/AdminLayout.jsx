import { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { HambergerMenu, ExportSquare } from 'iconsax-react';
import { IconUser } from '@/layouts/admin/adminNavIcons';
import AdminSidebar from '@/layouts/admin/AdminSidebar';
import { useAdminSidebar } from '@/hooks/admin/layout';
import { CBLoader } from '@/components';
import { cn } from '@/utils/cn';
import styles from '@/layouts/admin/AdminLayout.module.css';

function AdminRouteFallback() {
  return (
    <div className={styles.routeFallback} aria-live="polite">
      <CBLoader size="md" label="Loading page" />
    </div>
  );
}

export default function AdminLayout() {
  const { collapsed, menuOpen, isMobile, toggleCollapse, toggleMenu, closeMenu } = useAdminSidebar();

  return (
    <div className={cn(styles.layout, collapsed && styles.layoutCollapsed)}>
      {isMobile && menuOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <AdminSidebar
        collapsed={collapsed}
        isMobile={isMobile}
        menuOpen={menuOpen}
        onToggleCollapse={toggleCollapse}
        onCloseMenu={closeMenu}
      />

      <div className={styles.main}>
        <header className={styles.topbar}>
          {isMobile && (
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <HambergerMenu size={22} color="currentColor" variant="Bold" />
            </button>
          )}

          <div className={styles.topbarActions}>
            {isMobile && (
              <Link to="/" className={styles.viewSiteMobile} aria-label="View customer site">
                <ExportSquare size={20} color="currentColor" variant="Outline" />
              </Link>
            )}
            <span className={styles.userIcon} aria-label="Admin user">
              <IconUser />
            </span>
          </div>
        </header>

        <div className={styles.content}>
          <Suspense fallback={<AdminRouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
