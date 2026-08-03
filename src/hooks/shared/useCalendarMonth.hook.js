import { useEffect, useMemo, useState } from 'react';

import { formatMonthYear, getCalendarWeeks, toDateString } from '@/utils/scheduleUtils';

export const CALENDAR_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function useCalendarMonth({
  selectedDate = '',
  allowPast = true,
  syncSelected = true,
} = {}) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) {
      return new Date(`${selectedDate}T12:00:00`).getMonth();
    }
    return today.getMonth();
  });
  const [viewYear, setViewYear] = useState(() => {
    if (selectedDate) {
      return new Date(`${selectedDate}T12:00:00`).getFullYear();
    }
    return today.getFullYear();
  });

  useEffect(() => {
    if (!syncSelected || !selectedDate) return;
    const selected = new Date(`${selectedDate}T12:00:00`);
    setViewMonth(selected.getMonth());
    setViewYear(selected.getFullYear());
  }, [selectedDate, syncSelected]);

  const weeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const goMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const canGoPrev = allowPast
    || viewYear > today.getFullYear()
    || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return {
    today,
    todayStr: toDateString(today),
    weeks,
    viewMonth,
    viewYear,
    monthLabel: formatMonthYear(viewYear, viewMonth),
    goMonth,
    canGoPrev,
  };
}
