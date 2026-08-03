export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function formatTime24(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTime12(time24) {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function getDaySchedule(dateStr, schedule) {
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  return schedule.weeklyHours.find((entry) => entry.day === day);
}

export function isDateSelectable(dateStr, schedule) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T12:00:00`);
  if (target < today) return false;
  if (schedule.disabledDates.includes(dateStr)) return false;

  const daySchedule = getDaySchedule(dateStr, schedule);
  return Boolean(daySchedule && !daySchedule.closed);
}

export function getAllSlotsForDate(dateStr, schedule) {
  const daySchedule = getDaySchedule(dateStr, schedule);
  if (!daySchedule || daySchedule.closed) return [];

  const interval = schedule.slotIntervalMinutes || 30;
  const start = parseTimeToMinutes(daySchedule.open);
  const end = parseTimeToMinutes(daySchedule.close);
  const slots = [];

  for (let minutes = start; minutes < end; minutes += interval) {
    slots.push(formatTime24(minutes));
  }

  return slots;
}

export function getAvailableSlots(dateStr, schedule) {
  if (!isDateSelectable(dateStr, schedule)) return [];

  const disabled = schedule.disabledSlots[dateStr] || [];
  const now = new Date();
  const isToday = dateStr === toDateString(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return getAllSlotsForDate(dateStr, schedule)
    .filter((time) => !disabled.includes(time))
    .filter((time) => !isToday || parseTimeToMinutes(time) > currentMinutes)
    .map((time) => ({ value: time, label: formatTime12(time) }));
}

function buildSlotOptions(times) {
  return times.map((time) => ({ value: time, label: formatTime12(time) }));
}

function getFallbackDayHours(schedule) {
  return schedule.weeklyHours.find((entry) => !entry.closed) ?? {
    open: '09:00',
    close: '19:00',
  };
}

function getSlotsForHours(schedule, { open, close }) {
  const interval = schedule.slotIntervalMinutes || 30;
  const start = parseTimeToMinutes(open);
  const end = parseTimeToMinutes(close);
  const slots = [];

  for (let minutes = start; minutes < end; minutes += interval) {
    slots.push(formatTime24(minutes));
  }

  return slots;
}

export function getAdminSlotsForDate(dateStr, schedule) {
  const daySchedule = getDaySchedule(dateStr, schedule);
  const hours = daySchedule && !daySchedule.closed
    ? daySchedule
    : getFallbackDayHours(schedule);

  return buildSlotOptions(getSlotsForHours(schedule, hours));
}

export function isSlotEnabled(dateStr, time, schedule) {
  return getAvailableSlots(dateStr, schedule).some((slot) => slot.value === time);
}

export function getCalendarWeeks(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const weeks = [];
  let week = [];

  for (let i = 0; i < startOffset; i += 1) {
    week.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    week.push({ date, dateStr: toDateString(date), inMonth: true });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function hoursKey(entry) {
  if (entry.closed) return 'closed';
  return `${entry.open}-${entry.close}`;
}

export function formatWeeklyHoursForDisplay(schedule) {
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const byDay = Object.fromEntries(schedule.weeklyHours.map((entry) => [entry.day, entry]));
  const ordered = dayOrder.map((day) => byDay[day]).filter(Boolean);

  const rows = [];
  let index = 0;

  while (index < ordered.length) {
    const start = ordered[index];
    let end = index + 1;

    while (end < ordered.length && hoursKey(ordered[end]) === hoursKey(start)) {
      end += 1;
    }

    const slice = ordered.slice(index, end);
    const day =
      slice.length === 1
        ? slice[0].label
        : `${slice[0].label} – ${slice[slice.length - 1].label}`;

    const hours = start.closed
      ? 'Closed'
      : `${formatTime12(start.open)} – ${formatTime12(start.close)}`;

    rows.push({ day, hours });
    index = end;
  }

  return rows;
}
