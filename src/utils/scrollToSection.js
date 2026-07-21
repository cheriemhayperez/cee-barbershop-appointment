export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return false;

  const header = document.querySelector('header');
  const offset = header?.offsetHeight ?? 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  window.history.replaceState(null, '', `#${sectionId}`);
  return true;
}

export function parseSectionId(href) {
  const hash = href.includes('#') ? href.split('#')[1] : href;
  return hash?.split('?')[0] || '';
}
