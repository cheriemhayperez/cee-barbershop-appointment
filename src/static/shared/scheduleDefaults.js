import { SCHEDULE_SLOT_INTERVAL_MINUTES } from '@/constants/data/schedule.data';

export const defaultSchedule = {
  slotIntervalMinutes: SCHEDULE_SLOT_INTERVAL_MINUTES,
  weeklyHours: [
    { day: 0, label: 'Sunday', closed: false, open: '10:00', close: '16:00' },
    { day: 1, label: 'Monday', closed: false, open: '09:00', close: '19:00' },
    { day: 2, label: 'Tuesday', closed: false, open: '09:00', close: '19:00' },
    { day: 3, label: 'Wednesday', closed: false, open: '09:00', close: '19:00' },
    { day: 4, label: 'Thursday', closed: false, open: '09:00', close: '19:00' },
    { day: 5, label: 'Friday', closed: false, open: '09:00', close: '19:00' },
    { day: 6, label: 'Saturday', closed: false, open: '08:00', close: '18:00' },
  ],
  disabledDates: [],
  disabledSlots: {},
};
