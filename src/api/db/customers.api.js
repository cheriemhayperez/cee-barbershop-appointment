import { supabase } from '@/lib/supabase';
import { mapCustomerFromDb, mapCustomerToDb } from '@/api/db/mappers';

export async function fetchCustomers() {
  const { data, error } = await supabase.from('customers').select('*').order('name');
  if (error) throw error;
  return data.map(mapCustomerFromDb);
}

export async function insertCustomer(customer) {
  const { data, error } = await supabase
    .from('customers')
    .insert(mapCustomerToDb(customer))
    .select()
    .single();
  if (error) throw error;
  return mapCustomerFromDb(data);
}

export async function updateCustomer(id, updates) {
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.visits !== undefined) payload.visits = updates.visits;
  if (updates.lastVisit !== undefined) payload.last_visit = updates.lastVisit || null;

  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapCustomerFromDb(data);
}

export async function deleteCustomer(id) {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}
