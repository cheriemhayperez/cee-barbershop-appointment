import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useCustomerHome } from '@/hooks/customer';
import { images } from '@/static/shared/images';
import { testimonials } from '@/static/customer/homeContent';
import HowItWorks from '@/pages/customer/Home/HowItWorks';
import ServicesSection from '@/pages/customer/Home/ServicesSection';
import styles from '@/pages/customer/Home/CustomerHome.module.css';

export default function CustomerHome() {
  useCustomerHome();

  return (
    <PageTransition className={styles.page}>
      <section id="hero" className={`${styles.hero} ${styles.heroFull}`}>
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
            <Link to="/book" className={styles.ctaPrimary}>Book Appointment</Link>
          </div>
        </motion.div>
      </section>

      <HowItWorks />
      <ServicesSection />

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
    </PageTransition>
  );
}
