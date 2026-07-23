import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { scrollToSection } from '@/utils/scrollToSection';

export function useCustomerHome() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo || location.hash.replace('#', '');
    if (!sectionId) return undefined;

    const timer = window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, location.state]);
}
