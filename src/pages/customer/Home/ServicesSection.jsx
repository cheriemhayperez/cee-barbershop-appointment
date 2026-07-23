import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn/FadeIn';
import ServiceIcon from '@/components/ServiceIcon/ServiceIcon';
import { homeServices, homeServicesIntro } from '@/static/customer/homeContent';
import shop from '@/static/shop.json';
import sectionStyles from '@/pages/customer/Home/SectionLayout.module.css';
import styles from '@/pages/customer/Home/ServicesSection.module.css';

export default function ServicesSection() {
  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.textureShade} aria-hidden="true" />
      <div className={styles.sectionInner}>
        <FadeIn>
          <div className={styles.header}>
            <p className={`${sectionStyles.eyebrow} ${styles.eyebrow}`}>What We Offer</p>
            <h2 className={`${sectionStyles.sectionTitle} ${styles.sectionTitle}`}>{shop.name}</h2>
            <p className={styles.intro}>{homeServicesIntro}</p>
          </div>
        </FadeIn>
        <div className={styles.grid}>
          {homeServices.map((service, index) => (
            <FadeIn key={service.name} delay={index * 0.06} className={styles.gridItem}>
              <motion.article className={styles.card} whileHover={{ y: -2 }}>
                <div className={styles.iconWrap}>
                  <ServiceIcon icon={service.icon} size={64} className={styles.icon} />
                </div>
                <h3>{service.name}</h3>
                <p className={styles.desc}>{service.description}</p>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
