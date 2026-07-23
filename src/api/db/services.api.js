import { supabase } from '@/lib/supabase';
import { mapServiceFromDb, mapServiceToDb } from '@/api/db/mappers';

export async function fetchServices() {
  const { data, error } = await supabase.from('services').select('*').order('name');
  if (error) throw error;
  return data.map(mapServiceFromDb);
}

export async function insertService(service) {
  const { data, error } = await supabase
    .from('services')
    .insert(mapServiceToDb(service))
    .select()
    .single();
  if (error) throw error;
  return mapServiceFromDb(data);
}

export async function updateService(id, updates) {
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('services')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapServiceFromDb(data);
}

export async function deleteService(id) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
