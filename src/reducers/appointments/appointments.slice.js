import { createListSlice } from '@/reducers/shared/createListSlice';

const slice = createListSlice({
  name: 'appointments',
  listKey: 'appointments',
  initialItems: [],
});

export const appointmentsReducer = slice.reducer;
export const {
  setAll: setAppointments,
  add: addAppointment,
  update: updateAppointment,
  remove: removeAppointment,
} = slice.actions;
