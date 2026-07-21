import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { images } from '@/static/shared/images';
import { testimonials } from '@/static/customer/homeContent';
import { scrollToSection } from '@/utils/scrollToSection';
import AboutSection from '@/pages/customer/Home/AboutSection';
import BarbersSection from '@/pages/customer/Home/BarbersSection';
import ContactSection from '@/pages/customer/Home/ContactSection';
import GallerySection from '@/pages/customer/Home/GallerySection';
import HowItWorks from '@/pages/customer/Home/HowItWorks';
import ServicesSection from '@/pages/customer/Home/ServicesSection';
import styles from '@/pages/customer/Home/CustomerHome.module.css';

export default function CustomerHome() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo || location.hash.replace('#', '');
    if (!sectionId) return undefined;

    const timer = window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, location.state]);

  return (
    <PageTransition className={styles.page}>
      <div className={styles.aboveFold}>
        <section id="hero" className={styles.hero}>
          <div
            className={styles.heroBg}
            style={{ backgroundImage: `url(${images.hero})` }}
            aria-hidden="true"
          />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <svg
            className={styles.heroWave}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,64L48,80C96,96,192,128,288,117.3C384,107,480,53,576,48C672,43,768,85,864,96C960,107,1056,85,1152,69.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z" />
          </svg>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className={styles.eyebrow}>Premium grooming since 2018</p>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Look sharp. Feel confident.
            </motion.h1>
            <p className={styles.heroSubtitle}>
              Cee Barbershop — where precision meets style. Walk-ins welcome, appointments preferred.
            </p>
            <div className={styles.heroActions}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link to="/book" className={styles.ctaPrimary}>Book Appointment</Link>
              </motion.div>
              <a href="#services" className={styles.ctaSecondary}>View Services</a>
            </div>
          </motion.div>
        </section>

      <AboutSection />
      </div>

      <HowItWorks />
      <ServicesSection />
      <BarbersSection />
      <GallerySection />

      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.testimonialsInner}>
          <FadeIn>
            <p className={styles.eyebrow}>Customer Testimonials</p>
            <h2 className={styles.sectionTitle}>What our clients say</h2>
          </FadeIn>
        </div>
        <div className={styles.testimonialsMarquee} aria-label="Customer testimonials">
          <div className={styles.testimonialsTrack}>
            {[...testimonials, ...testimonials].map((t, index) => (
              <blockquote
                key={`${t.name}-${index}`}
                className={styles.testimonialCard}
              >
                <div className={styles.stars} aria-label={`${t.rating} stars`}>
                  {'★'.repeat(t.rating)}
                </div>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <footer>— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <section id="booking" className={styles.bookingBanner}>
        <FadeIn>
          <h2>Ready for your next cut?</h2>
          <p>Book online in under 2 minutes. No account required.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link to="/book" className={styles.ctaPrimary}>Book Appointment Online</Link>
          </motion.div>
        </FadeIn>
      </section>
    </PageTransition>
  );
}
