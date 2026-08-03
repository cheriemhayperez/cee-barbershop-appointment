import { useState } from 'react';

export function clearFieldError(errors, name) {
  if (!errors[name]) {
    return errors;
  }

  const next = { ...errors };
  delete next[name];
  return next;
}

export function useFormFieldErrors(validateField, validateSubmit) {
  const [fieldErrors, setFieldErrors] = useState({});

  const resetFieldErrors = () => setFieldErrors({});

  const validateOnChange = (name, value, form, context = {}) => {
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const { errors } = validateField(name, value, { form, ...context });
      if (errors[name]) {
        return { ...prev, [name]: errors[name] };
      }

      return clearFieldError(prev, name);
    });
  };

  const runSubmitValidation = (form, context = {}) => {
    const { errors, valid } = validateSubmit(form, context);
    setFieldErrors(errors);
    return valid;
  };

  const clearFieldErrors = (...names) => {
    setFieldErrors((prev) => names.reduce((acc, name) => clearFieldError(acc, name), prev));
  };

  return {
    fieldErrors,
    resetFieldErrors,
    validateOnChange,
    runSubmitValidation,
    clearFieldErrors,
  };
}
