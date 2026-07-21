import { createId } from '@/utils/idUtils';

export function addToList(list, item) {
  return [...list, { ...item, id: item.id ?? createId() }];
}

export function updateInList(list, id, updates) {
  return list.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry));
}

export function removeFromList(list, id) {
  return list.filter((entry) => entry.id !== id);
}
