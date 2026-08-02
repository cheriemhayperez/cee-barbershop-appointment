import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchAppointments } from '@/api/db/appointments.api';
import { fetchBarbers } from '@/api/db/barbers.api';
import { fetchCustomers } from '@/api/db/customers.api';
import { fetchSchedule } from '@/api/db/schedule.api';
import { fetchShop } from '@/api/db/shop.api';
import { fetchServices } from '@/api/db/services.api';

export async function fetchAllData() {
  if (!isSupabaseConfigured) return null;

  const [appointments, barbers, services, customers, schedule, shop] = await Promise.all([
    fetchAppointments(),
    fetchBarbers(),
    fetchServices(),
    fetchCustomers(),
    fetchSchedule(),
    fetchShop(),
  ]);

  return { appointments, barbers, services, customers, schedule, shop };
}

export * from '@/api/db/appointments.api';
export * from '@/api/db/barbers.api';
export * from '@/api/db/customers.api';
export * from '@/api/db/schedule.api';
export * from '@/api/db/shop.api';
export * from '@/api/db/services.api';
