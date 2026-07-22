import { isSupabaseConfigured } from '@/lib/supabase';
import {
  insertAppointment,
  updateAppointment as updateAppointmentDb,
  deleteAppointment as deleteAppointmentDb,
  insertBarber,
  updateBarber as updateBarberDb,
  deleteBarber as deleteBarberDb,
  insertCustomer,
  updateCustomer as updateCustomerDb,
  deleteCustomer as deleteCustomerDb,
  insertService,
  updateService as updateServiceDb,
  deleteService as deleteServiceDb,
} from '@/api/db';
import { createId } from '@/utils/idUtils';

async function persist(action) {
  if (!isSupabaseConfigured) return;
  return action();
}

export async function syncAddAppointment(dispatch, addAction, form) {
  const id = createId();
  const item = { ...form, id };

  if (isSupabaseConfigured) {
    const saved = await insertAppointment(item);
    dispatch(addAction(saved));
    return saved;
  }

  dispatch(addAction(item));
  return item;
}

export async function syncUpdateAppointment(dispatch, updateAction, id, updates) {
  if (isSupabaseConfigured) {
    const saved = await updateAppointmentDb(id, updates);
    dispatch(updateAction({ id, updates: saved }));
    return saved;
  }

  dispatch(updateAction({ id, updates }));
}

export async function syncRemoveAppointment(dispatch, removeAction, id) {
  await persist(() => deleteAppointmentDb(id));
  dispatch(removeAction(id));
}

export async function syncAddBarber(dispatch, addAction, barber) {
  const item = { ...barber, id: barber.id ?? createId() };

  if (isSupabaseConfigured) {
    const saved = await insertBarber(item);
    dispatch(addAction(saved));
    return saved;
  }

  dispatch(addAction(item));
  return item;
}

export async function syncUpdateBarber(dispatch, updateAction, id, updates) {
  if (isSupabaseConfigured) {
    const saved = await updateBarberDb(id, updates);
    dispatch(updateAction({ id, updates: saved }));
    return saved;
  }

  dispatch(updateAction({ id, updates }));
}

export async function syncRemoveBarber(dispatch, removeAction, id) {
  await persist(() => deleteBarberDb(id));
  dispatch(removeAction(id));
}

export async function syncAddService(dispatch, addAction, form) {
  const item = { ...form, id: createId() };

  if (isSupabaseConfigured) {
    const saved = await insertService(item);
    dispatch(addAction(saved));
    return saved;
  }

  dispatch(addAction(item));
  return item;
}

export async function syncUpdateService(dispatch, updateAction, id, updates) {
  if (isSupabaseConfigured) {
    const saved = await updateServiceDb(id, updates);
    dispatch(updateAction({ id, updates: saved }));
    return saved;
  }

  dispatch(updateAction({ id, updates }));
}

export async function syncRemoveService(dispatch, removeAction, id) {
  await persist(() => deleteServiceDb(id));
  dispatch(removeAction(id));
}

export async function syncAddCustomer(dispatch, addAction, form) {
  const item = { ...form, id: createId() };

  if (isSupabaseConfigured) {
    const saved = await insertCustomer(item);
    dispatch(addAction(saved));
    return saved;
  }

  dispatch(addAction(item));
  return item;
}

export async function syncUpdateCustomer(dispatch, updateAction, id, updates) {
  if (isSupabaseConfigured) {
    const saved = await updateCustomerDb(id, updates);
    dispatch(updateAction({ id, updates: saved }));
    return saved;
  }

  dispatch(updateAction({ id, updates }));
}

export async function syncRemoveCustomer(dispatch, removeAction, id) {
  await persist(() => deleteCustomerDb(id));
  dispatch(removeAction(id));
}
