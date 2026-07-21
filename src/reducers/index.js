import { combineReducers } from '@reduxjs/toolkit';

import { appointmentsReducer } from '@/reducers/appointments/appointments.slice';
import { barbersReducer } from '@/reducers/barbers/barbers.slice';
import { customersReducer } from '@/reducers/customers/customers.slice';
import { servicesReducer } from '@/reducers/services/services.slice';

const rootReducer = combineReducers({
  appointments: appointmentsReducer,
  barbers: barbersReducer,
  customers: customersReducer,
  services: servicesReducer,
});

export default rootReducer;
