export function isEmpty(value = '') {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().replace(/\s/g, '').length === 0;
  }

  return false;
}

export function validateField(name, value = '', message = 'This field is required.') {
  const errors = {};
  let valid = true;

  if (isEmpty(value)) {
    errors[name] = message;
    valid = false;
  }

  return { errors, valid };
}

export function validateObject(object, message = 'This field is required.') {
  const errors = {};
  let valid = true;

  Object.entries(object).forEach(([key, value]) => {
    if (isEmpty(value)) {
      errors[key] = message;
      valid = false;
    }
  });

  return { errors, valid };
}
