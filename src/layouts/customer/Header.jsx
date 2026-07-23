import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HambergerMenu, CloseCircle } from 'iconsax-react';
import CBLogoMark from '@/components/CBLogoMark/CBLogoMark';
import { useCustomerHeader } from '@/hooks/customer/layout';
import styles from '@/layouts/customer/Header.module.css';

const customerNav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

function navLinkClass(baseClass, activeClass, isActive) {
  return [baseClass, isActive ? activeClass : ''].filter(Boolean).join(' ');
}

export default function Header() {
  const {
    isScrolled,
    menuOpen,
    toggleMenu,
    closeMenu,
    isLightPage,
    isHomeHero,
    isNavActive,
  } = useCustomerHeader();

  const headerClassName = [
    styles.header,
    styles.customer,
    isScrolled ? styles.scrolled : '',
    !isScrolled && isLightPage ? styles.lightPage : '',
    isHomeHero ? styles.homeHero : '',
    menuOpen ? styles.menuOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClassName}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo} aria-label="CEE Barbershop home">
          <CBLogoMark size="header" className={styles.logoMark} alt="" />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {customerNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={navLinkClass(
                styles.navLink,
                styles.navLinkActive,
                isNavActive(item.to)
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <CloseCircle size={22} color="currentColor" variant="Bold" />
            ) : (
              <HambergerMenu size={22} color="currentColor" variant="Bold" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className={styles.mobileNav}
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {customerNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={navLinkClass(
                    styles.mobileNavLink,
                    styles.mobileNavLinkActive,
                    isNavActive(item.to)
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
