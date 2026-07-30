import { requiredError } from '@/validations/admin/shared.validate';

export function validateAdminAppointmentField(name, value, context = {}) {
  const errors = {};
  const form = context.form ?? {};

  switch (name) {
    case 'name': {
      const err = requiredError(value);
      if (err) errors.name = err;
      break;
    }
    case 'service': {
      const err = requiredError(value, 'Please select a service.');
      if (err) errors.service = err;
      break;
    }
    case 'date': {
      const err = requiredError(value, 'Please select a date.');
      if (err) errors.date = err;
      break;
    }
    case 'time': {
      if (!requiredError(form.date)) {
        const err = requiredError(value, 'Please select a time.');
        if (err) errors.time = err;
      }
      break;
    }
    default:
      break;
  }

  return { errors };
}

export function validateSubmitAdminAppointment(form) {
  const errors = {};

  const nameErr = requiredError(form.name);
  if (nameErr) errors.name = nameErr;

  const serviceErr = requiredError(form.service, 'Please select a service.');
  if (serviceErr) errors.service = serviceErr;

  const dateErr = requiredError(form.date, 'Please select a date.');
  if (dateErr) errors.date = dateErr;

  if (!dateErr) {
    const timeErr = requiredError(form.time, 'Please select a time.');
    if (timeErr) errors.time = timeErr;
  }

  return { errors, valid: Object.keys(errors).length === 0 };
}
