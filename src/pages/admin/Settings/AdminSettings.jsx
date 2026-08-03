import { CBCard, CBButton, CBInput, CBLoader, CBBusyOverlay, CBSaveStatus } from '@/components';
import { useAdminShopInfo } from '@/hooks/admin';
import styles from '@/pages/admin/shared/AdminPage.module.css';

export default function AdminSettings() {
  const {
    loaded,
    form,
    fieldErrors,
    syncError,
    saveStatus,
    saveError,
    isSaving,
    hasChanges,
    handleChange,
    handleSubmit,
  } = useAdminShopInfo();

  if (!loaded) {
    return (
      <div className={styles.settingsLoading} aria-live="polite">
        <CBLoader size="md" label="Loading shop info" />
      </div>
    );
  }

  return (
    <div className={styles.settingsGrid}>
      <CBCard title="Shop Info" className={styles.shopInfoCard}>
        <p className={styles.note}>Shown on the customer site footer and contact page.</p>
        <form className={styles.shopForm} onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
          {isSaving && (
            <CBBusyOverlay
              size="sm"
              label="Saving shop info"
              className={styles.shopFormOverlay}
            />
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
            <CBSaveStatus status={saveStatus} error={saveError} />
            <CBButton
              variant="primary"
              size="small"
              type="submit"
              loading={isSaving}
              disabled={!hasChanges || isSaving}
            >
              Save shop info
            </CBButton>
          </div>
        </form>
      </CBCard>
    </div>
  );
}
