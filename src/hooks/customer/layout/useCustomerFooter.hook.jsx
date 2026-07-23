import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBookingSchedule } from '@/hooks/customer/booking';
import { shop } from '@/static/shop';
import { formatWeeklyHoursForDisplay } from '@/utils/scheduleUtils';

const PAGES_WITHOUT_VISIT_BAND = ['/book', '/services'];

export function useCustomerFooter() {
  const { schedule } = useBookingSchedule();
  const { pathname } = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const businessHours = useMemo(
    () => formatWeeklyHoursForDisplay(schedule),
    [schedule]
  );

  const hideVisitSection = PAGES_WITHOUT_VISIT_BAND.includes(pathname);

  const footerLocation = shop.footerLocation || shop.city;

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    businessHours,
    footerLocation,
    hideVisitSection,
    scrollToTop,
    showBackToTop,
  };
}
