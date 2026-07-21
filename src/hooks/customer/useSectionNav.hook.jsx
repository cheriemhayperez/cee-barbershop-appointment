import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseSectionId, scrollToSection } from '@/utils/scrollToSection';

export default function useSectionNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = useCallback((href, event) => {
    if (event) event.preventDefault();

    const sectionId = parseSectionId(href);
    if (!sectionId) return;

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    scrollToSection(sectionId);
  }, [location.pathname, navigate]);

  return goToSection;
}
