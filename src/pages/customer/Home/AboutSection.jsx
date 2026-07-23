import FadeIn from '@/components/FadeIn/FadeIn';
import { aboutContent } from '@/static/customer/homeContent';
import { images } from '@/static/shared/images';
import sectionStyles from '@/pages/customer/Home/SectionLayout.module.css';
import styles from '@/pages/customer/Home/AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={`${sectionStyles.section} ${sectionStyles.sectionLight} ${styles.section}`}>
      <div className={sectionStyles.sectionInner}>
        <FadeIn>
          <p className={sectionStyles.eyebrow}>About Us</p>
          <h1 className={sectionStyles.sectionTitle}>More than just a haircut</h1>
        </FadeIn>

        <div className={styles.grid}>
          <FadeIn delay={0.1}>
            <div className={styles.copy}>
              <p className={styles.lead}>{aboutContent.lead}</p>
              <p className={styles.support}>{aboutContent.support}</p>
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.body}>
                  {paragraph}
                </p>
              ))}
              <ul className={styles.highlights}>
                {aboutContent.highlights.map((item) => (
                  <li key={item.title} className={styles.highlightItem}>
                    <span className={styles.highlightTitle}>{item.title}</span>
                    <span className={styles.highlightText}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className={styles.imageWrap}>
              <img src={images.aboutShop} alt="Barber at work in Cee Barbershop" className={styles.image} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
