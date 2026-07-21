import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CBLogoMark from '@/components/CBLogoMark/CBLogoMark';
import { appName } from '@/constants/app.config';
import useSectionNav from '@/hooks/customer/useSectionNav.hook';
import styles from '@/layouts/customer/Header.module.css';

const customerNav = [
  { to: '/#about', label: 'About' },
  { to: '/#services', label: 'Services' },
  { to: '/#barbers', label: 'Barbers' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#contact', label: 'Contact' },
];

const SCROLL_THRESHOLD = 48;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const goToSection = useSectionNav();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerClassName = [
    styles.header,
    styles.customer,
    isScrolled ? styles.scrolled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClassName}>
      <Link to="/" className={styles.logo}>
        <CBLogoMark size="sm" className={styles.logoMark} />
        {appName}
      </Link>

      <nav className={styles.nav}>
        {customerNav.map((item) => (
          <a
            key={item.to}
            href={item.to}
            className={styles.navLink}
            onClick={(event) => goToSection(item.to, event)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link to="/book" className={styles.headerCta}>
          Book Appointment
        </Link>
      </motion.div>
    </header>
  );
}
