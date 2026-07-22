let cachedSchedule = null;
const listeners = new Set();

export function setLoadedSchedule(schedule) {
  cachedSchedule = schedule;
  listeners.forEach((listener) => listener(schedule));
}

export function subscribeSchedule(listener) {
  listeners.add(listener);
  if (cachedSchedule) listener(cachedSchedule);
  return () => listeners.delete(listener);
}

export function getCachedSchedule() {
  return cachedSchedule;
}
