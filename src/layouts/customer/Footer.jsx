import { Link } from 'react-router-dom';
import useSectionNav from '@/hooks/customer/useSectionNav.hook';
import { shop, phoneHref } from '@/static/shop';
import styles from '@/layouts/customer/Footer.module.css';

export default function Footer() {
  const goToSection = useSectionNav();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <p className={styles.footerBrand}>{shop.name}</p>
          <p className={styles.footerTagline}>Precision cuts. Premium experience.</p>
        </div>
        <div>
          <p className={styles.footerHeading}>Quick Links</p>
          <nav className={styles.footerNav}>
            <a href="/#about" onClick={(e) => goToSection('/#about', e)}>About</a>
            <a href="/#services" onClick={(e) => goToSection('/#services', e)}>Services</a>
            <a href="/#contact" onClick={(e) => goToSection('/#contact', e)}>Contact</a>
            <Link to="/book">Book Online</Link>
          </nav>
        </div>
        <div>
          <p className={styles.footerHeading}>Contact</p>
          <p>{shop.address}</p>
          <p>{shop.city}</p>
          <p><a href={`tel:${phoneHref()}`}>{shop.phone}</a></p>
        </div>
      </div>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {shop.name}
      </p>
    </footer>
  );
}
