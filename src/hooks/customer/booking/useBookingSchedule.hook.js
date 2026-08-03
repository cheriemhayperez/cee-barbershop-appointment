import { useCallback, useEffect, useRef, useState } from 'react';
import { SCHEDULE_STORAGE_KEY, defaultSchedule } from '@/constants';
import { saveSchedule as saveScheduleDb } from '@/api/db/schedule.api';
import { useSaveStatus } from '@/hooks/shared/useSaveStatus.hook';
import { isSupabaseConfigured } from '@/lib/supabase';
import { subscribeSchedule } from '@/utils/scheduleBus';

const DEBOUNCE_MS = 450;

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
  const { saveStatus, saveError, isSaving, withSave } = useSaveStatus();

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSchedule(loadLocalSchedule());
      setLoaded(true);
      return;
    }

    const unsubscribe = subscribeSchedule((loadedSchedule) => {
      setSchedule(loadedSchedule);
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

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const persistNow = useCallback(async (nextSchedule) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    return withSave(
      () => persistSchedule(nextSchedule),
      'Failed to save schedule.'
    );
  }, [withSave]);

  const queuePersist = useCallback((nextSchedule) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      persistNow(nextSchedule).catch(() => {});
    }, DEBOUNCE_MS);
  }, [persistNow]);

  const updateSchedule = useCallback((updater, { immediate = false } = {}) => {
    let nextSchedule;

    setSchedule((prev) => {
      nextSchedule = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return nextSchedule;
    });

    if (immediate) {
      persistNow(nextSchedule).catch(() => {});
      return;
    }

    queuePersist(nextSchedule);
  }, [persistNow, queuePersist]);

  const setWeeklyHours = useCallback((weeklyHours) => {
    updateSchedule((prev) => ({ ...prev, weeklyHours }));
  }, [updateSchedule]);

  const addDisabledDate = useCallback((dateStr) => {
    updateSchedule((prev) => ({
      ...prev,
      disabledDates: prev.disabledDates.includes(dateStr)
        ? prev.disabledDates
        : [...prev.disabledDates, dateStr].sort(),
    }), { immediate: true });
  }, [updateSchedule]);

  const removeDisabledDate = useCallback((dateStr) => {
    updateSchedule((prev) => ({
      ...prev,
      disabledDates: prev.disabledDates.filter((d) => d !== dateStr),
      disabledSlots: Object.fromEntries(
        Object.entries(prev.disabledSlots).filter(([key]) => key !== dateStr)
      ),
    }), { immediate: true });
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
    }, { immediate: true });
  }, [updateSchedule]);

  return {
    schedule,
    loaded,
    isSaving,
    saveStatus,
    saveError,
    updateSchedule,
    setWeeklyHours,
    addDisabledDate,
    removeDisabledDate,
    toggleSlot,
  };
}
