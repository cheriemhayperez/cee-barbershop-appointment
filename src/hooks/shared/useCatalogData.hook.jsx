import { useSelector } from 'react-redux';

export function useCatalogData() {
  const services = useSelector((state) =>
    state.services.services.filter((s) => s.status === 'active')
  );
  const barbers = useSelector((state) =>
    state.barbers.barbers.filter((b) => b.status === 'active')
  );

  const catalogServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    price: service.price,
    duration: service.duration,
    desc: service.description ?? '',
  }));

  return { services: catalogServices, barbers };
}

export function getBarberLabel(barbers, id) {
  if (!id || id === 'any') return 'No preference';
  return barbers.find((b) => b.id === id)?.name ?? 'No preference';
}
