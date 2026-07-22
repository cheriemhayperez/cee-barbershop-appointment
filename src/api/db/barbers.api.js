import { supabase } from '@/lib/supabase';
import { images } from '@/static/shared/images';
import { mapBarberFromDb, mapBarberToDb } from '@/api/db/mappers';

export async function fetchBarbers() {
  const { data, error } = await supabase.from('barbers').select('*').order('name');
  if (error) throw error;
  return data.map(mapBarberFromDb);
}

export async function insertBarber(barber) {
  const { data, error } = await supabase
    .from('barbers')
    .insert(mapBarberToDb(barber))
    .select()
    .single();
  if (error) throw error;
  return mapBarberFromDb(data);
}

export async function updateBarber(id, updates) {
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.exp !== undefined) payload.exp = updates.exp;
  if (updates.specialty !== undefined) payload.specialty = updates.specialty;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.photo !== undefined) {
    const photoIndex = images.barbers.indexOf(updates.photo);
    payload.photo_index = photoIndex >= 0 ? photoIndex : 0;
  }

  const { data, error } = await supabase
    .from('barbers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapBarberFromDb(data);
}

export async function deleteBarber(id) {
  const { error } = await supabase.from('barbers').delete().eq('id', id);
  if (error) throw error;
}
