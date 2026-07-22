import { useCallback, useEffect, useState } from 'react';
import { SCHEDULE_STORAGE_KEY } from '@/constants/data/schedule.data';
import { saveSchedule as saveScheduleDb } from '@/api/db/schedule.api';
import { isSupabaseConfigured } from '@/lib/supabase';
import { defaultSchedule } from '@/static/shared/scheduleDefaults';
import { subscribeSchedule } from '@/utils/scheduleBus';

function loadLocalSchedule() {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return defaultSchedule;
    return { ...defaultSchedule, ...JSON.parse(raw) };
  } catch {
    return defaultSchedule;
  }
}

function saveLocalSchedule(schedule) {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
}

function notifyScheduleUpdated() {
  window.dispatchEvent(new Event('cb-schedule-updated'));
}

async function persistSchedule(schedule) {
  if (isSupabaseConfigured) {
    await saveScheduleDb(schedule);
  } else {
    saveLocalSchedule(schedule);
  }
  notifyScheduleUpdated();
}

export function useBookingSchedule() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [loaded, setLoaded] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSchedule(loadLocalSchedule());
      setLoaded(true);
      return;
    }

    const unsubscribe = subscribeSchedule((loaded) => {
      setSchedule(loaded);
      setLoaded(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const sync = () => {
      if (!isSupabaseConfigured) {
        setSchedule(loadLocalSchedule());
      }
    };
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
      persistSchedule(next);
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
    loaded,
    updateSchedule,
    setWeeklyHours,
    addDisabledDate,
    removeDisabledDate,
    toggleSlot,
  };
}
