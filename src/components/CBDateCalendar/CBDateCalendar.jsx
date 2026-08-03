import CBButton from '@/components/CBButton/CBButton';
import { CALENDAR_WEEKDAYS, useCalendarMonth } from '@/hooks/shared/useCalendarMonth.hook';
import { cn } from '@/utils/cn';
import styles from '@/components/CBDateCalendar/CBDateCalendar.module.css';

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
  const {
    todayStr,
    weeks,
    monthLabel,
    goMonth,
    canGoPrev,
  } = useCalendarMonth({
    selectedDate: value,
    allowPast,
  });

  const blockedSet = new Set(blockedDates);

  const isSelectable = (dateStr) => {
    if (disabled) return false;

    const target = new Date(`${dateStr}T12:00:00`);
    const today = new Date(`${todayStr}T12:00:00`);
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
        <span className={styles.monthLabel}>{monthLabel}</span>
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

              const selectable = isSelectable(cell.dateStr);
              const selected = value === cell.dateStr;
              const isToday = cell.dateStr === todayStr;
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
