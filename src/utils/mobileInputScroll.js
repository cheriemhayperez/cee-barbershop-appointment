const MOBILE_QUERY = '(max-width: 768px)';

export function scrollInputAboveKeyboard(field) {
  if (!(field instanceof HTMLElement)) return;
  if (!window.matchMedia(MOBILE_QUERY).matches) return;

  const viewport = window.visualViewport;
  if (!viewport) return;

  const headerHeight =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    ) || 80;

  const rect = field.getBoundingClientRect();
  const visibleBottom = viewport.offsetTop + viewport.height - 16;
  const visibleTop = viewport.offsetTop + headerHeight + 8;

  if (rect.bottom > visibleBottom) {
    window.scrollBy({ top: rect.bottom - visibleBottom, left: 0, behavior: 'auto' });
    return;
  }

  if (rect.top < visibleTop) {
    window.scrollBy({ top: rect.top - visibleTop, left: 0, behavior: 'auto' });
  }
}

export function handleMobileInputFocus(event) {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

  window.setTimeout(() => scrollInputAboveKeyboard(field), 350);
}
