import { useMemo } from 'react';

import CBButton from '@/components/CBButton/CBButton';
import { CALENDAR_WEEKDAYS, useCalendarMonth } from '@/hooks/shared/useCalendarMonth.hook';
import { cn } from '@/utils/cn';
import styles from '@/components/CBAppointmentCalendar/CBAppointmentCalendar.module.css';

export default function CBAppointmentCalendar({
  appointments,
  selectedDate,
  onSelectDate,
}) {
  const {
    todayStr,
    weeks,
    monthLabel,
    goMonth,
  } = useCalendarMonth({
    selectedDate,
    allowPast: true,
    syncSelected: false,
  });

  const countsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((appt) => {
      map[appt.date] = (map[appt.date] || 0) + 1;
    });
    return map;
  }, [appointments]);

  return (
    <section className={styles.calendar} aria-label="Appointments calendar">
      <div className={styles.header}>
        <div className={styles.nav}>
          <CBButton
            type="button"
            variant="secondary"
            size="small"
            className={styles.navBtn}
            onClick={() => goMonth(-1)}
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
      </div>

      <div className={styles.weekdayRow}>
        {CALENDAR_WEEKDAYS.map((day) => (
          <span key={day} className={styles.weekday}>{day}</span>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {weeks.flat().map((cell, index) => {
          if (!cell) {
            return <span key={`empty-${index}`} className={styles.dayEmpty} />;
          }

          const count = countsByDate[cell.dateStr] || 0;
          const isSelected = selectedDate === cell.dateStr;
          const isToday = cell.dateStr === todayStr;

          return (
            <CBButton
              key={cell.dateStr}
              type="button"
              variant="secondary"
              className={cn(
                styles.dayBtn,
                count > 0 && styles.dayHasAppointments,
                isSelected && styles.daySelected,
                isToday && styles.dayToday
              )}
              onClick={() => onSelectDate(cell.dateStr)}
              aria-label={
                count
                  ? `${cell.dateStr}, ${count} appointment${count === 1 ? '' : 's'}`
                  : cell.dateStr
              }
            >
              <span className={styles.dayNumber}>{cell.date.getDate()}</span>
              {count > 0 && (
                <span className={styles.countBadge} aria-hidden="true">
                  {count}
                </span>
              )}
            </CBButton>
          );
        })}
      </div>
    </section>
  );
}
