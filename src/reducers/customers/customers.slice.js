import { initialCustomers } from '@/static/admin/initialData';
import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'customers',
  listKey: 'customers',
  initialItems: initialCustomers,
});

export const customersReducer = slice.reducer;
export const {
  add: addCustomer,
  update: updateCustomer,
  remove: removeCustomer,
} = slice.actions;
