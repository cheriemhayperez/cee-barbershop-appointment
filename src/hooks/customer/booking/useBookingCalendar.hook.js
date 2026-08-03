import { useEffect, useMemo, useState } from 'react';

import { useCalendarMonth } from '@/hooks/shared/useCalendarMonth.hook';
import {
  formatTime12,
  getAdminSlotsForDate,
  getAvailableSlots,
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
  const {
    today,
    weeks,
    monthLabel,
    goMonth,
    canGoPrev,
  } = useCalendarMonth({
    selectedDate: date,
    allowPast: adminMode,
  });

  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setSelectedDate(date || '');
  }, [date]);

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

  const handleDateSelect = (dateStr) => {
    if (!isDateSelectable(dateStr, schedule)) return;

    setSelectedDate(dateStr);
    onDateChange(dateStr);
    onTimeChange?.('');
  };

  return {
    today,
    weeks,
    slots,
    daySchedule,
    selectedDate,
    monthLabel,
    goMonth,
    canGoPrev,
    handleDateSelect,
    isDateSelectable: (dateStr) => isDateSelectable(dateStr, schedule),
    toDateString,
  };
}
