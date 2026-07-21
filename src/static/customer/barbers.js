import { initialBarbers } from '@/static/admin/initialData';

export const barbers = initialBarbers.map(({ id, name, role, exp, specialty, photo }) => ({
  id,
  name,
  role,
  exp,
  specialty,
  photo,
}));

export const getBarberById = (id) => barbers.find((b) => b.id === id);

export const getBarberLabel = (id) => {
  if (!id || id === 'any') return 'No preference';
  return getBarberById(id)?.name ?? 'No preference';
};
