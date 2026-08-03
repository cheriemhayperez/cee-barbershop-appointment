import { cn } from '@/utils/cn';
import CBButton from '@/components/CBButton/CBButton';
import { useBookingCalendar, useBookingSchedule } from '@/hooks/customer';
import { CALENDAR_WEEKDAYS } from '@/hooks/shared/useCalendarMonth.hook';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/components/CBBookingSchedule/CBBookingSchedule.module.css';

export default function CBBookingSchedule({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
  compactAboveTime = false,
  variant = 'customer',
}) {
  const adminMode = variant === 'admin';
  const { schedule } = useBookingSchedule();
  const {
    today,
    weeks,
    slots,
    daySchedule,
    selectedDate,
    monthLabel,
    goMonth,
    canGoPrev,
    handleDateSelect,
    isDateSelectable,
    toDateString,
  } = useBookingCalendar({
    date,
    schedule,
    onDateChange,
    onTimeChange,
    adminMode,
    selectedTime: time,
  });

  const activeDate = selectedDate || date;

  return (
    <div
      className={cn(
        styles.wrap,
        adminMode && styles.adminTheme,
        compactAboveTime && styles.wrapCompactAboveTime,
        activeDate && slots.length > 0 && styles.wrapWithSlots
      )}
    >
      <div className={styles.fieldGroup}>
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
            {CALENDAR_WEEKDAYS.map((day) => (
              <span key={day} className={styles.weekday}>{day}</span>
            ))}
          </div>

          <div className={styles.daysWrap}>
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className={styles.daysGrid}>
                {week.map((cell, index) => {
                  if (!cell) {
                    return <span key={`empty-${weekIndex}-${index}`} className={styles.dayEmpty} />;
                  }

                  const selectable = isDateSelectable(cell.dateStr);
                  const selected = selectedDate === cell.dateStr;
                  const isToday = cell.dateStr === toDateString(today);
                  const isSelectedPast = selected && !selectable;

                  return (
                    <CBButton
                      key={cell.dateStr}
                      type="button"
                      variant="secondary"
                      className={cn(
                        styles.dayBtn,
                        selected && styles.daySelected,
                        isToday && styles.dayToday,
                        !selectable && styles.dayDisabled,
                        isSelectedPast && styles.daySelectedPast
                      )}
                      disabled={!selectable}
                      onClick={() => handleDateSelect(cell.dateStr)}
                    >
                      {cell.date.getDate()}
                    </CBButton>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        </fieldset>
        {dateError && <p className={styles.error}>{dateError}</p>}
      </div>

      <div className={cn(styles.fieldGroup, styles.timeFieldGroup)}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            Pick a time
            <span className={styles.requiredMark} aria-hidden="true">*</span>
          </legend>
        {!activeDate ? (
          <div className={cn(adminMode && styles.timePanel)}>
            <p className={styles.hint}>Select a date first to see available times.</p>
          </div>
        ) : slots.length === 0 ? (
          <div className={cn(adminMode && styles.timePanel)}>
            <p className={styles.hint}>No times available for this date. Try another day.</p>
          </div>
        ) : (
          <div className={cn(adminMode && styles.timePanel)}>
            {daySchedule && !daySchedule.closed && (
              <p className={styles.hoursHint}>
                Open {formatTime12(daySchedule.open)} – {formatTime12(daySchedule.close)}
              </p>
            )}
            {adminMode && daySchedule?.closed && (
              <p className={styles.hoursHint}>Shop closed — showing default hours for admin booking.</p>
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
          </div>
        )}
        </fieldset>
        {timeError && activeDate && <p className={styles.error}>{timeError}</p>}
      </div>
    </div>
  );
}
