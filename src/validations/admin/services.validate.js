import { priceError, requiredError } from '@/validations/admin/shared.validate';

export function validateAdminServiceField(name, value) {
  const errors = {};

  switch (name) {
    case 'name': {
      const err = requiredError(value);
      if (err) errors.name = err;
      break;
    }
    case 'price': {
      const err = priceError(value);
      if (err) errors.price = err;
      break;
    }
    case 'category': {
      const err = requiredError(value, 'Please select a category.');
      if (err) errors.category = err;
      break;
    }
    default:
      break;
  }

  return { errors };
}

export function validateSubmitAdminService(form) {
  const errors = {};

  const nameErr = requiredError(form.name);
  if (nameErr) errors.name = nameErr;

  const priceErr = priceError(form.price);
  if (priceErr) errors.price = priceErr;

  const categoryErr = requiredError(form.category, 'Please select a category.');
  if (categoryErr) errors.category = categoryErr;

  return { errors, valid: Object.keys(errors).length === 0 };
}
