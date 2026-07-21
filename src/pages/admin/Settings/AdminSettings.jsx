import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/FadeIn/FadeIn';
import { CBCard } from '@/components';
import { useBookingSchedule } from '@/hooks/customer/booking';
import { shop, fullAddress } from '@/static/shop';
import { formatWeeklyHoursForDisplay } from '@/utils/scheduleUtils';
import styles from '@/pages/admin/AdminPage.module.css';

export default function AdminSettings() {
  const { schedule } = useBookingSchedule();
  const businessHours = formatWeeklyHoursForDisplay(schedule);

  return (
    <FadeIn>
      <div className={styles.settingsGrid}>
        <CBCard title="Shop Info">
          <dl className={styles.dl}>
            <dt>Name</dt><dd>{shop.name}</dd>
            <dt>Address</dt><dd>{fullAddress()}</dd>
            <dt>Phone</dt><dd>{shop.phone}</dd>
            <dt>Email</dt><dd>{shop.email}</dd>
          </dl>
        </CBCard>

        <CBCard title="Business Hours">
          <p className={styles.note}>Shown on the customer site and used for booking.</p>
          <dl className={styles.dl}>
            {businessHours.map((row) => (
              <Fragment key={row.day}>
                <dt>{row.day}</dt>
                <dd>{row.hours}</dd>
              </Fragment>
            ))}
          </dl>
          <p className={styles.note}>
            Edit hours in{' '}
            <Link to="/admin/settings/schedule">Booking Schedule</Link>.
          </p>
        </CBCard>
      </div>
    </FadeIn>
  );
}
