import { useEffect, useRef } from 'react';

export function useVisualViewportHeaderFix() {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    const viewport = window.visualViewport;
    if (!header || !viewport) return undefined;

    const sync = () => {
      const keyboardOpen = viewport.height < window.innerHeight * 0.82;
      header.style.top = `${viewport.offsetTop}px`;
      header.style.width = `${viewport.width}px`;
      document.documentElement.classList.toggle('keyboard-open', keyboardOpen);
    };

    sync();
    viewport.addEventListener('scroll', sync);
    viewport.addEventListener('resize', sync);

    return () => {
      viewport.removeEventListener('scroll', sync);
      viewport.removeEventListener('resize', sync);
      header.style.top = '';
      header.style.width = '';
      document.documentElement.classList.remove('keyboard-open');
    };
  }, []);

  return headerRef;
}
