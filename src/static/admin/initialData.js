import { APPOINTMENT_STATUS } from '@/constants/data/appointments.data';
import { images } from '@/static/shared/images';

export { initialServices } from '@/static/services';

export const initialAppointments = [
  { id: '1', name: 'John Doe', service: 'Fade & Beard', barber: 'Marcus Reed', date: '2026-07-18', time: '10:00', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: '2', name: 'Mike Smith', service: 'Classic Cut', barber: 'Jay Santos', date: '2026-07-18', time: '11:30', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: '3', name: 'Alex Lee', service: 'Hot Towel Shave', barber: 'No preference', date: '2026-07-18', time: '14:00', status: APPOINTMENT_STATUS.PENDING },
  { id: '4', name: 'Sarah Lee', service: 'Kids Cut', barber: 'Devon Miles', date: '2026-07-17', time: '09:00', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: '5', name: 'James K.', service: 'VIP Package', barber: 'Marcus Reed', date: '2026-07-17', time: '15:00', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: '6', name: 'Andre P.', service: 'Buzz Cut', barber: 'Chris Webb', date: '2026-07-16', time: '13:00', status: APPOINTMENT_STATUS.CANCELLED },
  { id: '7', name: 'Tom R.', service: 'Classic Cut', barber: 'Jay Santos', date: '2026-07-15', time: '10:30', status: APPOINTMENT_STATUS.COMPLETED },
  { id: '8', name: 'Lisa M.', service: 'Fade & Beard', barber: 'Marcus Reed', date: '2026-07-14', time: '16:00', status: APPOINTMENT_STATUS.CONFIRMED },
];

export const initialBarbers = [
  { id: 'marcus', name: 'Marcus Reed', role: 'Master Barber', exp: '12 yrs', specialty: 'Fades & line-ups', photo: images.barbers[0], status: 'active' },
  { id: 'jay', name: 'Jay Santos', role: 'Senior Barber', exp: '8 yrs', specialty: 'Beard sculpting', photo: images.barbers[1], status: 'active' },
  { id: 'chris', name: 'Chris Webb', role: 'Barber', exp: '5 yrs', specialty: 'Classic cuts', photo: images.barbers[2], status: 'active' },
  { id: 'devon', name: 'Devon Miles', role: 'Barber', exp: '4 yrs', specialty: 'Kids & buzz cuts', photo: images.barbers[3], status: 'active' },
];

export const initialCustomers = [
  { id: '1', name: 'John Doe', email: 'john@email.com', phone: '+1 555-0101', visits: 12, lastVisit: '2026-07-15' },
  { id: '2', name: 'Mike Smith', email: 'mike@email.com', phone: '+1 555-0102', visits: 8, lastVisit: '2026-07-10' },
  { id: '3', name: 'Sarah Lee', email: 'sarah@email.com', phone: '+1 555-0103', visits: 3, lastVisit: '2026-07-12' },
  { id: '4', name: 'Alex Kim', email: 'alex@email.com', phone: '+1 555-0104', visits: 15, lastVisit: '2026-07-16' },
];
