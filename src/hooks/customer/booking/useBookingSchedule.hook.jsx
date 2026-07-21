import { useCallback, useEffect, useState } from 'react';
import { SCHEDULE_STORAGE_KEY } from '@/constants/data/schedule.data';
import { defaultSchedule } from '@/static/shared/scheduleDefaults';

function loadSchedule() {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return defaultSchedule;
    return { ...defaultSchedule, ...JSON.parse(raw) };
  } catch {
    return defaultSchedule;
  }
}

function saveSchedule(schedule) {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
  window.dispatchEvent(new Event('cb-schedule-updated'));
}

export function useBookingSchedule() {
  const [schedule, setSchedule] = useState(loadSchedule);

  useEffect(() => {
    const sync = () => setSchedule(loadSchedule());
    window.addEventListener('cb-schedule-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cb-schedule-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const updateSchedule = useCallback((updater) => {
    setSchedule((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveSchedule(next);
      return next;
    });
  }, []);

  const setWeeklyHours = useCallback((weeklyHours) => {
    updateSchedule((prev) => ({ ...prev, weeklyHours }));
  }, [updateSchedule]);

  const addDisabledDate = useCallback((dateStr) => {
    updateSchedule((prev) => ({
      ...prev,
      disabledDates: prev.disabledDates.includes(dateStr)
        ? prev.disabledDates
        : [...prev.disabledDates, dateStr].sort(),
    }));
  }, [updateSchedule]);

  const removeDisabledDate = useCallback((dateStr) => {
    updateSchedule((prev) => ({
      ...prev,
      disabledDates: prev.disabledDates.filter((d) => d !== dateStr),
      disabledSlots: Object.fromEntries(
        Object.entries(prev.disabledSlots).filter(([key]) => key !== dateStr)
      ),
    }));
  }, [updateSchedule]);

  const toggleSlot = useCallback((dateStr, time) => {
    updateSchedule((prev) => {
      const current = prev.disabledSlots[dateStr] || [];
      const nextForDate = current.includes(time)
        ? current.filter((t) => t !== time)
        : [...current, time].sort();

      const disabledSlots = { ...prev.disabledSlots };
      if (nextForDate.length) {
        disabledSlots[dateStr] = nextForDate;
      } else {
        delete disabledSlots[dateStr];
      }

      return { ...prev, disabledSlots };
    });
  }, [updateSchedule]);

  return {
    schedule,
    updateSchedule,
    setWeeklyHours,
    addDisabledDate,
    removeDisabledDate,
    toggleSlot,
  };
}
