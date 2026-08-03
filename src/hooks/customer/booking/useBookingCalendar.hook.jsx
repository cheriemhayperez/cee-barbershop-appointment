import { useEffect, useMemo, useState } from 'react';

import {
  formatMonthYear,
  formatTime12,
  getAdminSlotsForDate,
  getAvailableSlots,
  getCalendarWeeks,
  getDaySchedule,
  isDateSelectable,
  toDateString,
} from '@/utils/scheduleUtils';

export function useBookingCalendar({
  date,
  schedule,
  onDateChange,
  onTimeChange,
  adminMode = false,
  selectedTime = '',
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(() => {
    if (date) {
      const selected = new Date(`${date}T12:00:00`);
      return selected.getMonth();
    }
    return today.getMonth();
  });
  const [viewYear, setViewYear] = useState(() => {
    if (date) {
      const selected = new Date(`${date}T12:00:00`);
      return selected.getFullYear();
    }
    return today.getFullYear();
  });
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setSelectedDate(date || '');
    if (date) {
      const selected = new Date(`${date}T12:00:00`);
      setViewMonth(selected.getMonth());
      setViewYear(selected.getFullYear());
    }
  }, [date]);

  const weeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const slots = useMemo(() => {
    if (!selectedDate) return [];

    const available = getAvailableSlots(selectedDate, schedule);
    if (available.length > 0) return available;

    if (!adminMode || !selectedTime) return [];

    const adminSlots = getAdminSlotsForDate(selectedDate, schedule);
    if (adminSlots.some((slot) => slot.value === selectedTime)) {
      return adminSlots;
    }

    return [
      { value: selectedTime, label: formatTime12(selectedTime) },
      ...adminSlots,
    ];
  }, [adminMode, selectedDate, selectedTime, schedule]);

  const daySchedule = selectedDate
    ? getDaySchedule(selectedDate, schedule)
    : null;

  const goMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const handleDateSelect = (dateStr) => {
    if (!isDateSelectable(dateStr, schedule)) return;

    setSelectedDate(dateStr);
    onDateChange(dateStr);
    onTimeChange?.('');
  };

  const canGoPrev = adminMode
    || viewYear > today.getFullYear()
    || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return {
    today,
    weeks,
    slots,
    daySchedule,
    selectedDate,
    monthLabel: formatMonthYear(viewYear, viewMonth),
    goMonth,
    canGoPrev,
    handleDateSelect,
    isDateSelectable: (dateStr) => isDateSelectable(dateStr, schedule),
    toDateString,
  };
}
