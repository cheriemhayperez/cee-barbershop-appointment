export { cbAntdTheme } from '@/constants/theme.config';
export { EMAIL_BRAND } from '@/constants/email.brand';

export const appName = import.meta.env.VITE_APP_NAME || 'Cee Barbershop';

export const BADGE_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  NEUTRAL: 'neutral',
};

export const ADMIN_EMPTY_MESSAGE = 'No data to load';
export const ADMIN_MOBILE_BREAKPOINT = 1024;
export const ADMIN_MOBILE_QUERY = `(max-width: ${ADMIN_MOBILE_BREAKPOINT}px)`;

export const SHOP_STORAGE_KEY = 'cb-shop-info';
export const SCHEDULE_STORAGE_KEY = 'cb-booking-schedule';
export const SCHEDULE_SLOT_INTERVAL_MINUTES = 30;

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const APPOINTMENT_STATUS_BADGE_VARIANTS = {
  [APPOINTMENT_STATUS.PENDING]: BADGE_VARIANTS.WARNING,
  [APPOINTMENT_STATUS.CONFIRMED]: BADGE_VARIANTS.SUCCESS,
  [APPOINTMENT_STATUS.COMPLETED]: BADGE_VARIANTS.INFO,
  [APPOINTMENT_STATUS.CANCELLED]: BADGE_VARIANTS.DANGER,
};

export const SERVICE_CATEGORIES = [
  { value: 'head', label: 'Head' },
  { value: 'beard', label: 'Beard' },
  { value: 'shave', label: 'Shave' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'color', label: 'Color' },
];

export const CATEGORY_ICONS = {
  head: 'scissor',
  beard: 'beard',
  shave: 'brush',
  treatment: 'jar',
  color: 'color',
};

export const DEFAULT_SERVICE_CATEGORY = 'head';
export const DEFAULT_SERVICE_ICON = CATEGORY_ICONS[DEFAULT_SERVICE_CATEGORY];

export function getCategoryLabel(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label ?? 'Head';
}

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] ?? DEFAULT_SERVICE_ICON;
}

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
