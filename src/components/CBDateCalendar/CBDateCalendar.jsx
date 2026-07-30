import { useEffect, useMemo, useState } from 'react';

import CBButton from '@/components/CBButton/CBButton';
import { cn } from '@/utils/cn';
import { formatMonthYear, getCalendarWeeks, toDateString } from '@/utils/scheduleUtils';
import styles from '@/components/CBDateCalendar/CBDateCalendar.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CBDateCalendar({
  value = '',
  onChange,
  disabled = false,
  allowPast = false,
  isDateDisabled,
  blockedDates = [],
  compact = false,
  className,
  'aria-label': ariaLabel = 'Choose a date',
}) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      return new Date(`${value}T12:00:00`).getMonth();
    }
    return today.getMonth();
  });
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      return new Date(`${value}T12:00:00`).getFullYear();
    }
    return today.getFullYear();
  });

  useEffect(() => {
    if (!value) return;
    const selected = new Date(`${value}T12:00:00`);
    setViewMonth(selected.getMonth());
    setViewYear(selected.getFullYear());
  }, [value]);

  const weeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const blockedSet = useMemo(() => new Set(blockedDates), [blockedDates]);

  const goMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const canGoPrev = allowPast
    || viewYear > today.getFullYear()
    || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const isSelectable = (dateStr) => {
    if (disabled) return false;

    const target = new Date(`${dateStr}T12:00:00`);
    if (!allowPast && target < today) return false;
    if (isDateDisabled?.(dateStr)) return false;

    return true;
  };

  const handleSelect = (dateStr) => {
    if (!isSelectable(dateStr)) return;
    onChange?.(dateStr);
  };

  return (
    <div
      className={cn(styles.calendar, compact && styles.compact, className)}
      aria-label={ariaLabel}
    >
      <div className={styles.header}>
        <CBButton
          type="button"
          variant="secondary"
          size="small"
          className={styles.navBtn}
          onClick={() => goMonth(-1)}
          disabled={disabled || !canGoPrev}
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
          disabled={disabled}
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

      <div className={styles.daysWrap}>
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className={styles.daysGrid}>
            {week.map((cell, index) => {
              if (!cell) {
                return <span key={`empty-${weekIndex}-${index}`} className={styles.dayEmpty} />;
              }

              const selectable = isSelectable(cell.dateStr);
              const selected = value === cell.dateStr;
              const isToday = cell.dateStr === toDateString(today);
              const isBlocked = blockedSet.has(cell.dateStr);

              return (
                <CBButton
                  key={cell.dateStr}
                  type="button"
                  variant="secondary"
                  className={cn(
                    styles.dayBtn,
                    selected && styles.daySelected,
                    isToday && styles.dayToday,
                    isBlocked && styles.dayBlocked,
                    !selectable && styles.dayDisabled,
                  )}
                  disabled={!selectable}
                  onClick={() => handleSelect(cell.dateStr)}
                  aria-label={cell.dateStr}
                  aria-pressed={selected}
                >
                  {cell.date.getDate()}
                </CBButton>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
