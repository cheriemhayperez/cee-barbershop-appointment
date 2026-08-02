import { supabase } from '@/lib/supabase';
import { mapCustomerFromDb, mapCustomerToDb } from '@/api/db/mappers';
import { createId } from '@/utils/idUtils';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function pickLastVisit(current, next) {
  if (!current) return next;
  if (!next) return current;
  return next >= current ? next : current;
}

export async function fetchCustomers() {
  const { data, error } = await supabase.from('customers').select('*').order('name');
  if (error) throw error;
  return data.map(mapCustomerFromDb);
}

export async function findCustomerByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .ilike('email', normalizedEmail)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCustomerFromDb(data) : null;
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
  if (updates.email !== undefined) payload.email = normalizeEmail(updates.email);
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

export async function ensureCustomerByEmail({ name, email }) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await findCustomerByEmail(normalizedEmail);

  if (existing) {
    return {
      customer: await updateCustomer(existing.id, { name: name.trim() }),
      isNew: false,
    };
  }

  return {
    customer: await insertCustomer({
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      phone: '',
      visits: 0,
      lastVisit: '',
    }),
    isNew: true,
  };
}

export async function recordCustomerVisit({ name, email, date }) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await findCustomerByEmail(normalizedEmail);

  if (existing) {
    return {
      customer: await updateCustomer(existing.id, {
        name: name.trim(),
        visits: (existing.visits ?? 0) + 1,
        lastVisit: pickLastVisit(existing.lastVisit, date),
      }),
      isNew: false,
    };
  }

  return {
    customer: await insertCustomer({
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      phone: '',
      visits: 1,
      lastVisit: date,
    }),
    isNew: true,
  };
}

export async function deleteCustomer(id) {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}
