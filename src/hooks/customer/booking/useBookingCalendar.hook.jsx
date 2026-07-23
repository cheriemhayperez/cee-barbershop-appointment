import { useMemo, useState } from 'react';

import {
  formatMonthYear,
  getAvailableSlots,
  getCalendarWeeks,
  isDateSelectable,
  toDateString,
} from '@/utils/scheduleUtils';

export function useBookingCalendar({ date, schedule, onDateChange, onTimeChange }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const weeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const slots = useMemo(
    () => (date ? getAvailableSlots(date, schedule) : []),
    [date, schedule]
  );

  const daySchedule = date
    ? schedule.weeklyHours.find((d) => d.day === new Date(`${date}T12:00:00`).getDay())
    : null;

  const goMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const handleDateSelect = (dateStr) => {
    if (!isDateSelectable(dateStr, schedule)) return;
    onDateChange(dateStr);
    onTimeChange('');
  };

  const canGoPrev =
    viewYear > today.getFullYear()
    || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return {
    today,
    weeks,
    slots,
    daySchedule,
    monthLabel: formatMonthYear(viewYear, viewMonth),
    goMonth,
    canGoPrev,
    handleDateSelect,
    isDateSelectable: (dateStr) => isDateSelectable(dateStr, schedule),
    toDateString,
  };
}
