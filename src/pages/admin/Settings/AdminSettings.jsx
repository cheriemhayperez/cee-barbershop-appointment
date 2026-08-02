import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { CBCard, CBButton, CBInput, CBLoader } from '@/components';
import { useAdminShopInfo } from '@/hooks/admin/settings';
import { useBookingSchedule } from '@/hooks/customer/booking';
import { cn } from '@/utils/cn';
import { formatWeeklyHoursForDisplay } from '@/utils/scheduleUtils';
import styles from '@/pages/admin/AdminPage.module.css';

const SAVE_STATUS_LABELS = {
  saving: 'Saving…',
  saved: 'Changes saved',
  error: 'Save failed',
};

function ShopSaveStatus({ status, error }) {
  if (status === 'idle') return null;

  return (
    <span
      className={cn(
        styles.saveStatus,
        status === 'saving' && styles.saveStatusSaving,
        status === 'saved' && styles.saveStatusSaved,
        status === 'error' && styles.saveStatusError,
      )}
      role="status"
      aria-live="polite"
    >
      {status === 'error' && error ? error : SAVE_STATUS_LABELS[status]}
    </span>
  );
}

export default function AdminSettings() {
  const { schedule } = useBookingSchedule();
  const {
    loaded,
    form,
    fieldErrors,
    syncError,
    saveStatus,
    saveError,
    isSaving,
    handleChange,
    handleSubmit,
  } = useAdminShopInfo();
  const businessHours = formatWeeklyHoursForDisplay(schedule);

  if (!loaded) {
    return (
      <div className={styles.settingsLoading} aria-live="polite">
        <CBLoader size="md" label="Loading shop info" />
      </div>
    );
  }

  return (
    <div className={styles.settingsGrid}>
      <CBCard title="Shop Info">
        <p className={styles.note}>Shown on the customer site footer and contact page.</p>
        <form className={styles.shopForm} onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
          {isSaving && (
            <div className={styles.shopFormOverlay} aria-live="polite">
              <CBLoader size="sm" label="Saving shop info" />
            </div>
          )}

          {(syncError || saveError) && (
            <p className={styles.formError}>{syncError || saveError}</p>
          )}

          <fieldset className={styles.shopFormFields} disabled={isSaving}>
            <CBInput
              label="Name"
              name="name"
              value={form.name}
              error={fieldErrors.name}
              onChange={handleChange}
              required
            />
            <CBInput
              label="Address"
              name="address"
              value={form.address}
              error={fieldErrors.address}
              onChange={handleChange}
              required
            />
            <CBInput
              label="City / State / ZIP"
              name="city"
              value={form.city}
              error={fieldErrors.city}
              onChange={handleChange}
              required
            />
            <CBInput
              label="Footer location"
              name="footerLocation"
              value={form.footerLocation}
              error={fieldErrors.footerLocation}
              onChange={handleChange}
              placeholder="e.g. Downtown, CA"
            />
            <CBInput
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              error={fieldErrors.phone}
              onChange={handleChange}
              required
            />
            <CBInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              error={fieldErrors.email}
              onChange={handleChange}
              required
            />
          </fieldset>

          <div className={styles.shopFormActions}>
            <ShopSaveStatus status={saveStatus} error={saveError} />
            <CBButton variant="primary" size="small" type="submit" loading={isSaving} disabled={isSaving}>
              Save shop info
            </CBButton>
          </div>
        </form>
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
        <p className={styles.hoursEditNote}>
          <Link to="/admin/settings/schedule" className={styles.editLink}>
            Edit hours in Booking Schedule →
          </Link>
        </p>
      </CBCard>
    </div>
  );
}
