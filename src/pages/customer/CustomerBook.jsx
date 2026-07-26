import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { CBButton, CBInput, CBSelect, CBBookingSchedule, CBLoader } from '@/components';
import { useCustomerBook } from '@/hooks/customer/booking';
import { formatDisplayDate } from '@/utils/dateUtils';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/pages/customer/CustomerBook.module.css';

export default function CustomerBook() {
  const {
    barbers,
    services,
    form,
    submitted,
    isSubmitting,
    error,
    fieldErrors,
    confirmationMessage,
    emailsSent,
    dateError,
    timeError,
    getBarberLabel,
    handleChange,
    handleBarberSelect,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  } = useCustomerBook();

  const hasServices = services.length > 0;

  return (
    <PageTransition className={styles.page}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="book"
            className={styles.bookContent}
            aria-busy={isSubmitting}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isSubmitting && (
              <div className={styles.pageOverlay} aria-live="polite">
                <CBLoader label="Confirming booking" className={styles.pageLoader} />
              </div>
            )}

            <FadeIn>
              <h1 className={styles.title}>Book an Appointment</h1>
            </FadeIn>

            <form className={styles.form} onSubmit={handleSubmit}>
            <CBInput
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={fieldErrors.name}
              placeholder="John Doe"
              required
            />
            <CBInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={fieldErrors.email}
              placeholder="you@example.com"
              required
            />

            <CBSelect
              label="Service"
              name="service"
              value={form.service}
              onChange={handleChange}
              error={fieldErrors.service}
              required
              placeholder="Please select service"
              emptyMessage="No services available yet"
            >
              {services.map((s) => (
                <option key={s.id ?? s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </CBSelect>

            <fieldset className={styles.barberFieldset}>
              <legend className={styles.barberLegend}>Preferred Barber</legend>
              <p className={styles.barberHint}>Select a barber or choose no preference</p>
              <div className={styles.barberGrid}>
                <CBButton
                  type="button"
                  variant="secondary"
                  className={cn(styles.barberOption, form.barber === 'any' && styles.barberSelected)}
                  onClick={() => handleBarberSelect('any')}
                >
                  <span className={styles.barberAnyIcon}>?</span>
                  <span className={styles.barberName}>No preference</span>
                  <span className={styles.barberRole}>Any available barber</span>
                </CBButton>
                {barbers.map((barber) => (
                  <CBButton
                    key={barber.id}
                    type="button"
                    variant="secondary"
                    className={cn(styles.barberOption, form.barber === barber.id && styles.barberSelected)}
                    onClick={() => handleBarberSelect(barber.id)}
                  >
                    <img src={barber.photo} alt={barber.name} className={styles.barberPhoto} />
                    <span className={styles.barberName}>{barber.name}</span>
                    <span className={styles.barberRole}>{barber.specialty}</span>
                  </CBButton>
                ))}
              </div>
            </fieldset>

            <CBBookingSchedule
              date={form.date}
              time={form.time}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              dateError={dateError}
              timeError={timeError}
            />

            {error && <p className={styles.error}>{error}</p>}

            <CBButton
              variant="primary"
              size="medium"
              type="submit"
              className={styles.submitBtn}
              loading={isSubmitting}
              disabled={!hasServices || isSubmitting}
            >
              Confirm Booking
            </CBButton>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className={styles.success}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.successIconWrap} aria-hidden="true">
              <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M8 12.2 10.8 15 16 9.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className={styles.successTitle}>You&apos;re booked!</h2>
            <p className={styles.successLead}>
              See you at Cee Barbershop. Your appointment details are below.
            </p>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Date</span>
                <span className={styles.summaryValue}>{formatDisplayDate(form.date)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Time</span>
                <span className={styles.summaryValue}>{formatTime12(form.time)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Service</span>
                <span className={styles.summaryValue}>{form.service}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Barber</span>
                <span className={styles.summaryValue}>
                  {form.barber !== 'any' ? getBarberLabel(form.barber) : 'Any available barber'}
                </span>
              </div>
            </div>

            {emailsSent ? (
              <p className={styles.emailNote}>
                A confirmation email was sent to <strong>{form.email}</strong>.
                The shop owner has been notified about your appointment.
              </p>
            ) : (
              <p className={styles.emailNoteMuted}>{confirmationMessage}</p>
            )}

            <div className={styles.successActions}>
              <CBButton to="/" variant="primary" size="medium" className={styles.homeBtn}>
                Back to Home
              </CBButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
