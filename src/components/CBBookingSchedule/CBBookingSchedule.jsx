import { cn } from '@/utils/cn';
import CBButton from '@/components/CBButton/CBButton';
import { useBookingCalendar, useBookingSchedule } from '@/hooks/customer/booking';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/components/CBBookingSchedule/CBBookingSchedule.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CBBookingSchedule({ date, time, onDateChange, onTimeChange, error }) {
  const { schedule } = useBookingSchedule();
  const {
    today,
    weeks,
    slots,
    daySchedule,
    monthLabel,
    goMonth,
    canGoPrev,
    handleDateSelect,
    isDateSelectable,
    toDateString,
  } = useBookingCalendar({ date, schedule, onDateChange, onTimeChange });

  return (
    <div className={styles.wrap}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Pick a date
          <span className={styles.requiredMark} aria-hidden="true">*</span>
        </legend>
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <CBButton
              type="button"
              variant="secondary"
              size="small"
              className={styles.navBtn}
              onClick={() => goMonth(-1)}
              disabled={!canGoPrev}
              aria-label="Previous month"
            >
              ‹
            </CBButton>
            <span className={styles.monthLabel}>{monthLabel}</span>
            <CBButton
              type="button"
              variant="secondary"
              size="small"
              className={styles.navBtn}
              onClick={() => goMonth(1)}
              aria-label="Next month"
            >
              ›
            </CBButton>
          </div>

          <div className={styles.weekdayRow}>
            {WEEKDAYS.map((day) => (
              <span key={day} className={styles.weekday}>{day}</span>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {weeks.flat().map((cell, index) => {
              if (!cell) {
                return <span key={`empty-${index}`} className={styles.dayEmpty} />;
              }

              const selectable = isDateSelectable(cell.dateStr);
              const selected = date === cell.dateStr;
              const isToday = cell.dateStr === toDateString(today);

              return (
                <CBButton
                  key={cell.dateStr}
                  type="button"
                  variant="secondary"
                  className={cn(
                    styles.dayBtn,
                    selected && styles.daySelected,
                    isToday && styles.dayToday,
                    !selectable && styles.dayDisabled
                  )}
                  disabled={!selectable}
                  onClick={() => handleDateSelect(cell.dateStr)}
                >
                  {cell.date.getDate()}
                </CBButton>
              );
            })}
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Pick a time
          <span className={styles.requiredMark} aria-hidden="true">*</span>
        </legend>
        {!date ? (
          <p className={styles.hint}>Select a date first to see available times.</p>
        ) : slots.length === 0 ? (
          <p className={styles.hint}>No times available for this date. Try another day.</p>
        ) : (
          <>
            {daySchedule && (
              <p className={styles.hoursHint}>
                Open {formatTime12(daySchedule.open)} – {formatTime12(daySchedule.close)}
              </p>
            )}
            <div className={styles.slotsGrid}>
              {slots.map((slot) => (
                <CBButton
                  key={slot.value}
                  type="button"
                  variant="secondary"
                  className={cn(styles.slotBtn, time === slot.value && styles.slotSelected)}
                  onClick={() => onTimeChange(slot.value)}
                >
                  {slot.label}
                </CBButton>
              ))}
            </div>
          </>
        )}
      </fieldset>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
