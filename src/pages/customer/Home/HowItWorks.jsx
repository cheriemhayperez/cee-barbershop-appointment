import FadeIn from '@/components/FadeIn/FadeIn';
import sectionStyles from '@/pages/customer/shared/SectionLayout.module.css';
import styles from '@/pages/customer/Home/HowItWorks.module.css';

const steps = [
  {
    step: '01',
    title: 'Choose a Service',
    desc: 'Pick from cuts, shaves, beard trims, and packages.',
  },
  {
    step: '02',
    title: 'Pick Date & Time',
    desc: 'Select a slot that works for your schedule.',
  },
  {
    step: '03',
    title: 'Confirm Booking',
    desc: 'Get instant confirmation via email.',
  },
  {
    step: '04',
    title: 'Show Up & Relax',
    desc: 'Walk in, sit back, and leave looking sharp.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.sectionInner}>
        <FadeIn>
          <div className={styles.header}>
            <p className={`${sectionStyles.eyebrow} ${styles.eyebrow}`}>How It Works</p>
            <h2 className={`${sectionStyles.sectionTitle} ${styles.sectionTitle}`}>
              Book in 4 easy steps
            </h2>
          </div>
        </FadeIn>

        <ol className={styles.stepsList}>
          {steps.map((item, index) => (
            <li key={item.step} className={styles.stepItem}>
              <FadeIn delay={index * 0.08}>
                <article className={styles.stepCard}>
                  <span className={styles.stepNumber}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
