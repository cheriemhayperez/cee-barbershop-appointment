import { initialAppointments } from '@/static/admin/initialData';
import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'appointments',
  listKey: 'appointments',
  initialItems: initialAppointments,
});

export const appointmentsReducer = slice.reducer;
export const {
  add: addAppointment,
  update: updateAppointment,
  remove: removeAppointment,
} = slice.actions;
