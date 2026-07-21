import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn/FadeIn';
import { images } from '@/static/shared/images';
import sectionStyles from '@/pages/customer/Home/SectionLayout.module.css';
import styles from '@/pages/customer/Home/GallerySection.module.css';

export default function GallerySection() {
  return (
    <section id="gallery" className={`${sectionStyles.section} ${styles.section}`}>
      <div className={sectionStyles.sectionInner}>
        <FadeIn>
          <p className={sectionStyles.eyebrow}>Gallery</p>
          <h2 className={sectionStyles.sectionTitle}>Our work speaks for itself</h2>
        </FadeIn>
        <div className={styles.grid}>
          {images.gallery.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.08}>
              <motion.figure className={styles.item} whileHover={{ scale: 1.02 }}>
                <img src={item.src} alt={item.label} className={styles.image} />
                <figcaption className={styles.caption}>{item.label}</figcaption>
              </motion.figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
