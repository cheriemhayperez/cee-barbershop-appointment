import { cn } from '@/utils/cn';
import { useMemo, useState } from 'react';
import CBButton from '@/components/CBButton/CBButton';
import {
  formatMonthYear,
  getCalendarWeeks,
  toDateString,
} from '@/utils/scheduleUtils';
import styles from '@/components/CBAppointmentCalendar/CBAppointmentCalendar.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CBAppointmentCalendar({
  appointments,
  selectedDate,
  onSelectDate,
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const countsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((appt) => {
      map[appt.date] = (map[appt.date] || 0) + 1;
    });
    return map;
  }, [appointments]);

  const weeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const goMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

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
          <span className={styles.monthLabel}>{formatMonthYear(viewYear, viewMonth)}</span>
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
        {WEEKDAYS.map((day) => (
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
          const isToday = cell.dateStr === toDateString(today);

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
