import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'barbers',
  listKey: 'barbers',
  initialItems: [],
});

export const barbersReducer = slice.reducer;
export const {
  setAll: setBarbers,
  add: addBarber,
  update: updateBarber,
  remove: removeBarber,
} = slice.actions;
