import { requiredError } from '@/validations/admin/shared.validate';

const REQUIRED_FIELDS = ['name', 'role', 'exp', 'specialty'];

export function validateAdminBarberField(name, value) {
  const errors = {};

  if (REQUIRED_FIELDS.includes(name)) {
    const err = requiredError(value);
    if (err) errors[name] = err;
  }

  return { errors };
}

export function validateSubmitAdminBarber(form) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    const err = requiredError(form[field]);
    if (err) errors[field] = err;
  });

  return { errors, valid: Object.keys(errors).length === 0 };
}
