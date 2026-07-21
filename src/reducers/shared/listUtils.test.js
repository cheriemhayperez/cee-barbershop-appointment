import { describe, expect, it } from 'vitest';

import { addToList, removeFromList, updateInList } from '@/reducers/shared/listUtils';

describe('listUtils', () => {
  const list = [{ id: '1', name: 'Alpha' }];

  it('adds items with generated ids', () => {
    const next = addToList(list, { name: 'Beta' });
    expect(next).toHaveLength(2);
    expect(next[1].name).toBe('Beta');
    expect(next[1].id).toBeTruthy();
  });

  it('updates items by id', () => {
    const next = updateInList(list, '1', { name: 'Updated' });
    expect(next[0].name).toBe('Updated');
  });

  it('removes items by id', () => {
    const next = removeFromList(list, '1');
    expect(next).toHaveLength(0);
  });
});
