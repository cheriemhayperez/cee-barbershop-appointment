export function requiredError(value, message = 'This field is required.') {
  if (value === null || value === undefined) {
    return message;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return message;
  }

  return '';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailError(value) {
  const required = requiredError(value);
  if (required) return required;

  if (!EMAIL_REGEX.test(String(value).trim())) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function phoneError(value) {
  const required = requiredError(value);
  if (required) return required;

  const digits = String(value).replace(/\D/g, '');
  if (digits.length < 7) {
    return 'Enter a valid phone number.';
  }

  return '';
}

export function priceError(value) {
  const required = requiredError(value);
  if (required) return required;

  const normalized = String(value).trim().replace(/^\$/, '');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return 'Enter a valid price (e.g. $25).';
  }

  return '';
}
