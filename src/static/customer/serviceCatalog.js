/** Admin + /services page categories (grouped like homepage services, no bundles). */
export const SERVICE_CATEGORIES = [
  { value: 'head', label: 'Head' },
  { value: 'beard', label: 'Beard' },
  { value: 'shave', label: 'Shave' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'color', label: 'Color' },
];

/** Icon shown per category — matches homepage services styling. */
export const CATEGORY_ICONS = {
  head: 'scissor',
  beard: 'beard',
  shave: 'brush',
  treatment: 'jar',
  color: 'color',
};

export const DEFAULT_SERVICE_CATEGORY = 'head';
export const DEFAULT_SERVICE_ICON = CATEGORY_ICONS[DEFAULT_SERVICE_CATEGORY];

export function getCategoryLabel(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label ?? 'Head';
}

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] ?? DEFAULT_SERVICE_ICON;
}
