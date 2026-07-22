import { images } from '@/static/shared/images';

export function mapBarberFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    exp: row.exp,
    specialty: row.specialty,
    photo: images.barbers[row.photo_index] ?? images.barbers[0],
    status: row.status,
  };
}

export function mapBarberToDb(barber) {
  const photoIndex = images.barbers.indexOf(barber.photo);
  return {
    id: barber.id,
    name: barber.name,
    role: barber.role,
    exp: barber.exp,
    specialty: barber.specialty,
    photo_index: photoIndex >= 0 ? photoIndex : 0,
    status: barber.status,
  };
}

export function mapServiceFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    duration: row.duration,
    description: row.description ?? '',
    status: row.status,
  };
}

export function mapServiceToDb(service) {
  return {
    id: service.id,
    name: service.name,
    price: service.price,
    duration: service.duration,
    description: service.description ?? '',
    status: service.status,
  };
}

export function mapCustomerFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    visits: row.visits,
    lastVisit: row.last_visit ?? '',
  };
}

export function mapCustomerToDb(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    visits: customer.visits,
    last_visit: customer.lastVisit || null,
  };
}

export function mapAppointmentFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    service: row.service,
    barber: row.barber,
    date: row.date,
    time: row.time,
    status: row.status,
  };
}

export function mapAppointmentToDb(appointment) {
  return {
    id: appointment.id,
    name: appointment.name,
    email: appointment.email || null,
    service: appointment.service,
    barber: appointment.barber,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
  };
}
