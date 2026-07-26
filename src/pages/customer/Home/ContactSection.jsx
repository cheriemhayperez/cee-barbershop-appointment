import FadeIn from '@/components/FadeIn/FadeIn';
import { useBookingSchedule } from '@/hooks/customer/booking';
import { shop, phoneHref, mapsEmbedUrl } from '@/static/shop';
import { formatWeeklyHoursForDisplay } from '@/utils/scheduleUtils';
import sectionStyles from '@/pages/customer/Home/SectionLayout.module.css';
import styles from '@/pages/customer/Home/ContactSection.module.css';

export default function ContactSection() {
  const { schedule } = useBookingSchedule();
  const businessHours = formatWeeklyHoursForDisplay(schedule);

  return (
    <section className={`${sectionStyles.section} ${sectionStyles.sectionLight} ${styles.section}`}>
      <div className={sectionStyles.sectionInner}>
        <FadeIn>
          <p className={sectionStyles.eyebrow}>Contact Us</p>
          <h1 className={sectionStyles.sectionTitle}>Visit us or get in touch</h1>
        </FadeIn>
        <div className={styles.grid}>
          <FadeIn delay={0.1}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Shop Address</h2>
              <p>{shop.address}<br />{shop.city}</p>
              <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className={styles.link}>
                Get Directions →
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Business Hours</h2>
              <ul className={styles.hoursList}>
                {businessHours.map((row) => (
                  <li key={row.day}>
                    <span>{row.day}</span>
                    <span>{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Phone & Email</h2>
              <p>
                <a href={`tel:${phoneHref()}`} className={styles.link}>
                  {shop.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${shop.email}`} className={styles.link}>
                  {shop.email}
                </a>
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <div className={styles.mapWrap}>
            <iframe
              title={`${shop.name} location on Google Maps`}
              src={mapsEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
