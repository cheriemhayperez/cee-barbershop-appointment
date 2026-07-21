import FadeIn from '@/components/FadeIn/FadeIn';
import { images } from '@/static/shared/images';
import styles from '@/pages/customer/Home/AboutSection.module.css';

const stats = [
  { value: '6+', label: 'Years of craft' },
  { value: '4', label: 'Expert barbers' },
  { value: '5k+', label: 'Happy clients' },
];

export default function AboutSection() {
  return (
    <section id="about" className={styles.compactSection}>
      <div className={styles.compactInner}>
        <div className={`${styles.grid} ${styles.compactGrid}`}>
          <FadeIn delay={0.1}>
            <div className={styles.compactLeft}>
              <div className={styles.compactCopy}>
                <p className={styles.compactEyebrow}>About Us</p>
                <h2 className={styles.compactTitle}>More than just a haircut</h2>
                <p className={styles.compactLead}>
                  Walk into a clean shop, sit with a barber who listens, and leave looking your best.
                </p>
                <p className={styles.compactSupport}>
                  Fades, classic cuts, beard work, and hot-towel shaves — every time.
                </p>
                <div className={`${styles.stats} ${styles.compactStats}`}>
                  {stats.map((stat) => (
                    <div key={stat.label} className={styles.stat}>
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className={`${styles.imageWrap} ${styles.compactImageWrap}`}>
              <img src={images.aboutShop} alt="Barber at work in Cee Barbershop" className={styles.image} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
