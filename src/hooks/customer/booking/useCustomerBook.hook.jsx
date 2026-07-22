import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { doSubmitBooking } from '@/actions/customer/booking.action';
import { getBarberLabel, useCatalogData } from '@/hooks/shared/useCatalogData.hook';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isDateSelectable, isSlotEnabled } from '@/utils/scheduleUtils';
import { useBookingSchedule } from '@/hooks/customer/booking/useBookingSchedule.hook';

const initialForm = {
  name: '',
  email: '',
  service: '',
  barber: 'any',
  date: '',
  time: '',
};

export function useCustomerBook() {
  const dispatch = useDispatch();
  const { barbers, services } = useCatalogData();
  const { schedule } = useBookingSchedule();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [emailsSent, setEmailsSent] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [scheduleError, setScheduleError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBarberSelect = (barberId) => {
    setForm((prev) => ({ ...prev, barber: barberId }));
  };

  const handleDateChange = (date) => {
    setScheduleError('');
    setForm((prev) => ({ ...prev, date, time: '' }));
  };

  const handleTimeChange = (time) => {
    setScheduleError('');
    setForm((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setScheduleError('');

    if (!form.date || !isDateSelectable(form.date, schedule)) {
      setScheduleError('Please select an available date.');
      return;
    }
    if (!form.time || !isSlotEnabled(form.date, form.time, schedule)) {
      setScheduleError('Please select an available time slot.');
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
    confirmationMessage,
    emailsSent,
    scheduleError,
    isSupabaseConfigured,
    getBarberLabel: (id) => getBarberLabel(barbers, id),
    handleChange,
    handleBarberSelect,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
}
