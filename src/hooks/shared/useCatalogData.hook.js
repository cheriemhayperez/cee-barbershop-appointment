import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getCategoryIcon } from '@/constants';

export function useCatalogData() {
  const services = useSelector((state) =>
    state.services.services.filter((s) => s.status === 'active')
  );
  const barbers = useSelector((state) =>
    state.barbers.barbers.filter((b) => b.status === 'active')
  );

  const catalogServices = useMemo(
    () =>
      services.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        category: service.category ?? 'head',
        icon: getCategoryIcon(service.category),
      })),
    [services]
  );

  return { services: catalogServices, barbers };
}

export function getBarberLabel(barbers, id) {
  if (!id || id === 'any') return 'No preference';
  return barbers.find((b) => b.id === id)?.name ?? 'No preference';
}
