import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ADMIN_MOBILE_QUERY } from '@/constants/admin/breakpoints';

const STORAGE_KEY = 'cee-admin-sidebar-collapsed';

function readStoredCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function storeCollapsed(value) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore storage failures
  }
}

function readIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(ADMIN_MOBILE_QUERY).matches;
}

export function useAdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(readStoredCollapsed);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(readIsMobile);

  useEffect(() => {
    const mediaQuery = window.matchMedia(ADMIN_MOBILE_QUERY);
    const onChange = (event) => {
      setIsMobile(event.matches);
      if (event.matches) setMenuOpen(false);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen || !isMobile) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, isMobile]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      storeCollapsed(next);
      return next;
    });
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return {
    collapsed: isMobile ? false : collapsed,
    menuOpen,
    isMobile,
    toggleCollapse,
    toggleMenu,
    closeMenu,
  };
}
