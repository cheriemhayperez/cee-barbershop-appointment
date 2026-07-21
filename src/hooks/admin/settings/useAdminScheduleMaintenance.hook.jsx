import { useState } from 'react';

import {
  formatTime12,
  getAllSlotsForDate,
  toDateString,
} from '@/utils/scheduleUtils';
import { useBookingSchedule } from '@/hooks/customer/booking/useBookingSchedule.hook';

export function useAdminScheduleMaintenance() {
  const {
    schedule,
    setWeeklyHours,
    addDisabledDate,
    removeDisabledDate,
    toggleSlot,
  } = useBookingSchedule();

  const [blockDate, setBlockDate] = useState('');
  const [slotDate, setSlotDate] = useState(toDateString(new Date()));

  const slotsForManageDate = getAllSlotsForDate(slotDate, schedule);
  const disabledForDate = schedule.disabledSlots[slotDate] || [];

  const updateDay = (day, field, value) => {
    setWeeklyHours(
      schedule.weeklyHours.map((entry) =>
        entry.day === day ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleBlockDate = () => {
    if (blockDate) {
      addDisabledDate(blockDate);
      setBlockDate('');
    }
  };

  return {
    schedule,
    blockDate,
    setBlockDate,
    slotDate,
    setSlotDate,
    slotsForManageDate,
    disabledForDate,
    updateDay,
    handleBlockDate,
    removeDisabledDate,
    toggleSlot,
    formatTime12,
    toDateString,
  };
}
