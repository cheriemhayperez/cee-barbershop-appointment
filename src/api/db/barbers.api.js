import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { images } from '@/static/shared/images';
import { mapBarberFromDb, mapBarberToDb } from '@/api/db/mappers';
import { readFileAsDataUrl } from '@/utils/readFileAsDataUrl';

const PHOTO_BUCKET = 'barber-photos';
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

function validateBarberPhotoFile(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file.');
  }
  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error('Image must be 5 MB or smaller.');
  }
}

export async function uploadBarberPhoto(file, barberId) {
  validateBarberPhotoFile(file);

  if (!isSupabaseConfigured || !supabase) {
    return readFileAsDataUrl(file);
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filePath = `${barberId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (error) {
    throw new Error(error.message || 'Failed to upload barber photo.');
  }

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

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
    const isStaticPhoto = images.barbers.includes(updates.photo);

    if (isStaticPhoto) {
      payload.photo_index = Math.max(images.barbers.indexOf(updates.photo), 0);
      payload.photo_url = null;
    } else {
      payload.photo_url = updates.photo || null;
      payload.photo_index = 0;
    }
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
