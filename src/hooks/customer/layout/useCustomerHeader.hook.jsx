import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_THRESHOLD = 48;
const LIGHT_PAGES = ['/book', '/about', '/services', '/contact'];

export function useCustomerHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  const isLightPage = useMemo(
    () => LIGHT_PAGES.includes(location.pathname),
    [location.pathname]
  );

  const isHomeHero = location.pathname === '/' && !isScrolled;

  const isNavActive = useCallback(
    (to) => location.pathname === to,
    [location.pathname]
  );

  return {
    isScrolled,
    menuOpen,
    toggleMenu,
    isLightPage,
    isHomeHero,
    isNavActive,
  };
}
