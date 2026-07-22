import FadeIn from '@/components/FadeIn/FadeIn';
import { useCatalogData } from '@/hooks/shared/useCatalogData.hook';
import sectionStyles from '@/pages/customer/Home/SectionLayout.module.css';
import styles from '@/pages/customer/Home/BarbersSection.module.css';

export default function BarbersSection() {
  const { barbers } = useCatalogData();

  return (
    <section id="barbers" className={`${sectionStyles.section} ${sectionStyles.sectionAlt}`}>
      <div className={sectionStyles.sectionInner}>
        <FadeIn>
          <p className={sectionStyles.eyebrow}>Meet Our Barbers</p>
          <h2 className={sectionStyles.sectionTitle}>The team behind the chair</h2>
        </FadeIn>
        <div className={styles.grid}>
          {barbers.map((barber, index) => (
            <FadeIn key={barber.id} delay={index * 0.1}>
              <article className={styles.card}>
                <img src={barber.photo} alt={barber.name} className={styles.photo} />
                <h3>{barber.name}</h3>
                <p className={styles.role}>{barber.role} · {barber.exp}</p>
                <p className={styles.specialty}>{barber.specialty}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
