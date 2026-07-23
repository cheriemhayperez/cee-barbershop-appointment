export function formatServicePrice(price) {
  if (price == null) return '';

  const trimmed = String(price).trim();
  if (!trimmed) return '';

  if (/^\$/.test(trimmed)) return trimmed;
  if (/^\d/.test(trimmed)) return `$${trimmed}`;

  return trimmed;
}
