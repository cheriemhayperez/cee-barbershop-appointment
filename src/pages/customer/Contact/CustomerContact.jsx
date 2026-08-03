import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useBookingSchedule } from '@/hooks/customer';
import { useShopInfo } from '@/hooks/shared';
import { mapsEmbedUrl, phoneHref } from '@/utils/shopUtils';
import { formatWeeklyHoursForDisplay } from '@/utils/scheduleUtils';
import sectionStyles from '@/pages/customer/shared/SectionLayout.module.css';
import styles from '@/pages/customer/Contact/CustomerContact.module.css';

export default function CustomerContact() {
  const { schedule } = useBookingSchedule();
  const { shop } = useShopInfo();
  const businessHours = formatWeeklyHoursForDisplay(schedule);

  return (
    <PageTransition className={styles.page}>
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
                  <a href={`tel:${phoneHref(shop)}`} className={styles.link}>
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
                src={mapsEmbedUrl(shop)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
