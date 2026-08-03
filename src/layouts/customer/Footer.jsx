import { cn } from '@/utils/cn';
import { Link } from 'react-router-dom';
import { ArrowUp2 } from 'iconsax-react';
import CBLogoMark from '@/components/CBLogoMark/CBLogoMark';
import { useCustomerFooter } from '@/hooks/customer';
import { useShopInfo } from '@/hooks/shared';
import { phoneHref } from '@/utils/shopUtils';
import { images } from '@/static/shared/images';
import styles from '@/layouts/customer/Footer.module.css';

export default function Footer() {
  const { shop } = useShopInfo();
  const {
    businessHours,
    footerLocation,
    hideVisitSection,
    hideBookButton,
    scrollToTop,
    showBackToTop,
  } = useCustomerFooter();

  return (
    <footer className={styles.footer}>
      {!hideVisitSection && (
        <section
          className={styles.visitSection}
          aria-labelledby="footer-visit-heading"
        >
          <div
            className={styles.visitBg}
            style={{ backgroundImage: `url(${images.aboutShop})` }}
            aria-hidden="true"
          />
          <div className={styles.visitOverlay} aria-hidden="true" />
          <div className={styles.visitInner}>
            <h2 id="footer-visit-heading" className={styles.visitHeading}>
              Come visit {shop.name} today.
            </h2>
            <Link to="/book" className={styles.bookBtn}>
              Book Appointment
            </Link>
          </div>
        </section>
      )}

      <section className={styles.footerMain}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerHeadline}>
            Where style meets tradition in {footerLocation}.
          </h2>

          <div className={cn(styles.footerGrid, hideBookButton && styles.footerGridNoBook)}>
            <div className={styles.logoCol}>
              <Link to="/" className={styles.logoLink} aria-label={`${shop.name} home`}>
                <CBLogoMark size="lg" className={styles.footerLogo} alt="" />
              </Link>
            </div>

            <div className={styles.contactCol}>
              <p className={styles.colHeading}>{shop.name}</p>
              <p className={styles.address}>
                {shop.address}
                <br />
                {shop.city}
              </p>
              <a href={`tel:${phoneHref(shop)}`} className={styles.phone}>
                {shop.phone}
              </a>
            </div>

            <div className={styles.hoursCol}>
              <p className={styles.colHeading}>Our Hours</p>
              <ul className={styles.hoursList}>
                {businessHours.map((row) => (
                  <li key={row.day}>
                    <span className={styles.hoursDay}>{row.day}</span>
                    <span className={styles.hoursLeader} aria-hidden="true" />
                    <span className={styles.hoursTime}>{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!hideBookButton && (
              <div className={styles.actionsCol}>
                <Link to="/book" className={styles.bookBtn}>
                  Book Appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {shop.name}. All Rights Reserved.
          </p>
        </div>
      </section>

      {showBackToTop ? (
        <button
          type="button"
          className={styles.backToTop}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp2 size={18} color="currentColor" variant="Outline" />
        </button>
      ) : null}
    </footer>
  );
}
