import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn/FadeIn';
import { useCatalogData } from '@/hooks/shared/useCatalogData.hook';
import sectionStyles from '@/pages/customer/Home/SectionLayout.module.css';
import styles from '@/pages/customer/Home/ServicesSection.module.css';

export default function ServicesSection() {
  const { services } = useCatalogData();

  return (
    <section id="services" className={sectionStyles.section}>
      <div className={sectionStyles.sectionInner}>
        <FadeIn>
          <p className={sectionStyles.eyebrow}>Services & Pricing</p>
          <h2 className={sectionStyles.sectionTitle}>What we offer</h2>
        </FadeIn>
        <div className={styles.grid}>
          {services.map((service, index) => (
            <FadeIn key={service.id ?? service.name} delay={index * 0.08}>
              <motion.article
                className={styles.card}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(201,162,39,0.12)' }}
              >
                <h3>{service.name}</h3>
                <p className={styles.desc}>{service.desc}</p>
                <div className={styles.meta}>
                  <span className={styles.price}>{service.price}</span>
                  <span className={styles.duration}>{service.duration}</span>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
