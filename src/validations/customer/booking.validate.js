import { isDateSelectable, isSlotEnabled } from '@/utils/scheduleUtils';
import { isEmpty } from '@/validations';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;

function nameError(value) {
  const name = String(value ?? '').trim();

  if (isEmpty(name)) {
    return 'This field is required.';
  }

  if (name.length < MIN_NAME_LENGTH) {
    return `Enter at least ${MIN_NAME_LENGTH} characters.`;
  }

  return '';
}

function emailError(value) {
  const email = String(value ?? '').trim();

  if (isEmpty(email)) {
    return 'This field is required.';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Enter a valid email address.';
  }

  return '';
}

function serviceError(value) {
  if (isEmpty(value)) {
    return 'Please select a service.';
  }

  return '';
}

function dateError(value, schedule) {
  if (isEmpty(value)) {
    return 'Please select an available date.';
  }

  if (schedule && !isDateSelectable(value, schedule)) {
    return 'Please select an available date.';
  }

  return '';
}

function timeError(value, form, schedule) {
  if (isEmpty(form?.date)) {
    return '';
  }

  if (isEmpty(value)) {
    return 'Please select an available time slot.';
  }

  if (schedule && !isSlotEnabled(form.date, value, schedule)) {
    return 'Please select an available time slot.';
  }

  return '';
}

export function validateBookingField(name, value, context = {}) {
  const errors = {};
  const form = context.form ?? {};
  const schedule = context.schedule;

  switch (name) {
    case 'name': {
      const err = nameError(value);
      if (err) errors.name = err;
      break;
    }
    case 'email': {
      const err = emailError(value);
      if (err) errors.email = err;
      break;
    }
    case 'service': {
      const err = serviceError(value);
      if (err) errors.service = err;
      break;
    }
    case 'date': {
      const err = dateError(value, schedule);
      if (err) errors.date = err;
      break;
    }
    case 'time': {
      const err = timeError(value, form, schedule);
      if (err) errors.time = err;
      break;
    }
    default:
      break;
  }

  return { errors };
}

export function validateSubmitBooking(form, { schedule, hasServices = true } = {}) {
  const errors = {};

  if (!hasServices) {
    errors._form = 'No services are available to book yet.';
    return { errors, valid: false };
  }

  const nameErr = nameError(form.name);
  if (nameErr) errors.name = nameErr;

  const emailErr = emailError(form.email);
  if (emailErr) errors.email = emailErr;

  const serviceErr = serviceError(form.service);
  if (serviceErr) errors.service = serviceErr;

  const dateErr = dateError(form.date, schedule);
  if (dateErr) errors.date = dateErr;

  const timeErr = timeError(form.time, form, schedule);
  if (timeErr) errors.time = timeErr;

  return { errors, valid: Object.keys(errors).length === 0 };
}
