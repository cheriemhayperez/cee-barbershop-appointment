export function hasFormChanges(current, original, keys) {
  if (!original) return true;

  return keys.some((key) => normalizeFormValue(current?.[key]) !== normalizeFormValue(original?.[key]));
}

function normalizeFormValue(value) {
  if (value == null) return '';
  return String(value).trim();
}
