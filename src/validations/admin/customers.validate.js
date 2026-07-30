import {
  emailError,
  phoneError,
  requiredError,
} from '@/validations/admin/shared.validate';

export function validateAdminCustomerField(name, value) {
  const errors = {};

  switch (name) {
    case 'name': {
      const err = requiredError(value);
      if (err) errors.name = err;
      break;
    }
    case 'email': {
      const err = emailError(value);
      if (err) errors.email = err;
      break;
    }
    case 'phone': {
      const err = phoneError(value);
      if (err) errors.phone = err;
      break;
    }
    default:
      break;
  }

  return { errors };
}

export function validateSubmitAdminCustomer(form) {
  const errors = {};

  const nameErr = requiredError(form.name);
  if (nameErr) errors.name = nameErr;

  const emailErr = emailError(form.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = phoneError(form.phone);
  if (phoneErr) errors.phone = phoneErr;

  return { errors, valid: Object.keys(errors).length === 0 };
}
