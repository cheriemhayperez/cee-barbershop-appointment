import { createSlice } from '@reduxjs/toolkit';

import { addToList, removeFromList, updateInList } from '@/reducers/shared/listUtils';

export function createListSlice({ name, listKey, initialItems }) {
  return createSlice({
    name,
    initialState: { [listKey]: initialItems },
    reducers: {
      setAll: (state, { payload }) => {
        state[listKey] = payload;
      },
      add: (state, { payload }) => {
        state[listKey] = addToList(state[listKey], payload);
      },
      update: (state, { payload: { id, updates } }) => {
        state[listKey] = updateInList(state[listKey], id, updates);
      },
      remove: (state, { payload: id }) => {
        state[listKey] = removeFromList(state[listKey], id);
      },
    },
  });
}
