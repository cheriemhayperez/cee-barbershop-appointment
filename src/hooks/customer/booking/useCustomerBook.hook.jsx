import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { doSubmitBooking } from '@/actions/customer/booking.action';
import { getBarberLabel, useCatalogData } from '@/hooks/shared/useCatalogData.hook';
import { isSupabaseConfigured } from '@/lib/supabase';
import { validateBookingField, validateSubmitBooking } from '@/validations';
import { useBookingSchedule } from '@/hooks/customer/booking/useBookingSchedule.hook';

const initialForm = {
  name: '',
  email: '',
  service: '',
  barber: 'any',
  date: '',
  time: '',
};

function clearFieldError(errors, name) {
  if (!errors[name]) {
    return errors;
  }

  const next = { ...errors };
  delete next[name];
  return next;
}

export function useCustomerBook() {
  const dispatch = useDispatch();
  const { barbers, services } = useCatalogData();
  const { schedule } = useBookingSchedule();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [emailsSent, setEmailsSent] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };

    setForm(nextForm);
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const { errors } = validateBookingField(name, value, {
        form: nextForm,
        schedule,
      });
      if (errors[name]) {
        return { ...prev, [name]: errors[name] };
      }

      return clearFieldError(prev, name);
    });
  };

  const handleBarberSelect = (barberId) => {
    setForm((prev) => ({ ...prev, barber: barberId }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date, time: '' }));
    setFieldErrors((prev) => {
      const next = clearFieldError(prev, 'date');
      return clearFieldError(next, 'time');
    });
  };

  const handleTimeChange = (time) => {
    setForm((prev) => ({ ...prev, time }));
    setFieldErrors((prev) => clearFieldError(prev, 'time'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { errors, valid } = validateSubmitBooking(form, {
      schedule,
      hasServices: services.length > 0,
    });

    setFieldErrors(errors);

    if (!valid) {
      if (errors._form) {
        setError(errors._form);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await doSubmitBooking(form, { dispatch, barbers });
      setEmailsSent(result.emailsSent);
      setConfirmationMessage(result.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    barbers,
    services,
    form,
    submitted,
    isSubmitting,
    error,
    fieldErrors,
    confirmationMessage,
    emailsSent,
    dateError: fieldErrors.date || '',
    timeError: fieldErrors.time || '',
    isSupabaseConfigured,
    getBarberLabel: (id) => getBarberLabel(barbers, id),
    handleChange,
    handleBarberSelect,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
}
