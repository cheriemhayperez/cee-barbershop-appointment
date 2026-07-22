import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { CBButton, CBInput, CBSelect, CBBookingSchedule } from '@/components';
import { useCustomerBook } from '@/hooks/customer/booking';
import styles from '@/pages/customer/CustomerBook.module.css';

export default function CustomerBook() {
  const {
    barbers,
    services,
    form,
    submitted,
    isSubmitting,
    error,
    confirmationMessage,
    emailsSent,
    scheduleError,
    isSupabaseConfigured,
    getBarberLabel,
    handleChange,
    handleBarberSelect,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  } = useCustomerBook();

  return (
    <PageTransition className={styles.page}>
      <FadeIn>
        <h1 className={styles.title}>Book an Appointment</h1>
        <p className={styles.subtitle}>
          {isSupabaseConfigured
            ? 'Book online — testing mode sends emails to your Resend account email only.'
            : 'Add Supabase keys to .env.local to enable Resend email confirmations.'}
        </p>
      </FadeIn>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CBInput label="Name" name="name" value={form.name} onChange={handleChange} variant="dark" required />
            <CBInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} variant="dark" required />

            <CBSelect label="Service" name="service" value={form.service} onChange={handleChange} variant="dark" required>
              <option value="" disabled>
                {services.length ? 'Select a service' : 'No services available yet'}
              </option>
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
              error={scheduleError}
            />

            {error && <p className={styles.error}>{error}</p>}

            <CBButton
              variant="primary"
              size="medium"
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending confirmation…' : 'Confirm Booking'}
            </CBButton>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className={styles.success}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>You&apos;re booked!</h2>
            <p>
              See you on {form.date} at {form.time} for a {form.service}
              {form.barber !== 'any' ? ` with ${getBarberLabel(form.barber)}` : ''}.
            </p>
            {emailsSent ? (
              <p className={styles.emailNote}>
                A confirmation email was sent to <strong>{form.email}</strong>.
                The shop owner has been notified about your appointment.
              </p>
            ) : (
              <p className={styles.emailNoteMuted}>{confirmationMessage}</p>
            )}
            <CBButton to="/" variant="outline" size="small">Back to Home</CBButton>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
