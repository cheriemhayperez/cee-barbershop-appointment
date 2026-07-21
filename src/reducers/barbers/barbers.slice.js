import { initialBarbers } from '@/static/admin/initialData';
import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'barbers',
  listKey: 'barbers',
  initialItems: initialBarbers,
});

export const barbersReducer = slice.reducer;
export const {
  add: addBarber,
  update: updateBarber,
  remove: removeBarber,
} = slice.actions;
