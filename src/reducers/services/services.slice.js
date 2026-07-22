import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'services',
  listKey: 'services',
  initialItems: [],
});

export const servicesReducer = slice.reducer;
export const {
  setAll: setServices,
  add: addService,
  update: updateService,
  remove: removeService,
} = slice.actions;
