import { supabase } from '@/lib/supabase';
import { mapAppointmentFromDb, mapAppointmentToDb } from '@/api/db/mappers';

export async function fetchAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false });
  if (error) throw error;
  return data.map(mapAppointmentFromDb);
}

export async function insertAppointment(appointment) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(mapAppointmentToDb(appointment))
    .select()
    .single();
  if (error) throw error;
  return mapAppointmentFromDb(data);
}

export async function updateAppointment(id, updates) {
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.email !== undefined) payload.email = updates.email || null;
  if (updates.service !== undefined) payload.service = updates.service;
  if (updates.barber !== undefined) payload.barber = updates.barber;
  if (updates.date !== undefined) payload.date = updates.date;
  if (updates.time !== undefined) payload.time = updates.time;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('appointments')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapAppointmentFromDb(data);
}

export async function deleteAppointment(id) {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
}
