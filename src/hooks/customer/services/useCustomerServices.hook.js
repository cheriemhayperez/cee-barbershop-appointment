import { useMemo } from 'react';

import { useCatalogData } from '@/hooks/shared/useCatalogData.hook';
import { SERVICE_CATEGORIES } from '@/constants';

export function useCustomerServices() {
  const { services } = useCatalogData();

  const categories = useMemo(
    () =>
      SERVICE_CATEGORIES.map((category) => ({
        ...category,
        services: services.filter((service) => service.category === category.value),
      })).filter((category) => category.services.length > 0),
    [services]
  );

  return { categories, hasServices: categories.length > 0 };
}
