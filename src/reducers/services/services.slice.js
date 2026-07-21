import { initialServices } from '@/static/admin/initialData';
import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'services',
  listKey: 'services',
  initialItems: initialServices,
});

export const servicesReducer = slice.reducer;
export const {
  add: addService,
  update: updateService,
  remove: removeService,
} = slice.actions;
