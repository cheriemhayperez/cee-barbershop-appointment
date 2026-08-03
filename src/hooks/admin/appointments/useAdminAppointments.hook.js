import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APPOINTMENT_STATUS } from '@/constants';
import { useFormFieldErrors } from '@/hooks/shared/useFormFieldErrors.hook';
import { useConfirmDelete } from '@/hooks/shared/useConfirmDelete.hook';
import { useSubmitting } from '@/hooks/shared/useSubmitting.hook';
import {
  addAppointment,
  removeAppointment,
  updateAppointment,
} from '@/reducers/appointments/appointments.slice';
import {
  syncAddAppointment,
  syncRemoveAppointment,
  syncUpdateAppointment,
} from '@/services/dataSync';
import {
  validateAdminAppointmentField,
  validateSubmitAdminAppointment,
} from '@/validations/admin/appointments.validate';
import { hasFormChanges } from '@/utils/hasFormChanges';

const emptyForm = {
  name: '',
  service: '',
  barber: '',
  date: '',
  time: '',
  status: APPOINTMENT_STATUS.CONFIRMED,
};

const formKeys = ['name', 'service', 'barber', 'date', 'time', 'status'];

export function useAdminAppointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);
  const barbers = useSelector((state) => state.barbers.barbers);
  const services = useSelector((state) => state.services.services);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [originalForm, setOriginalForm] = useState(null);
  const [syncError, setSyncError] = useState('');
  const { isSubmitting, runIfChanged } = useSubmitting();
  const {
    fieldErrors,
    resetFieldErrors,
    validateOnChange,
    runSubmitValidation,
    clearFieldErrors,
  } = useFormFieldErrors(validateAdminAppointmentField, validateSubmitAdminAppointment);

  const openAdd = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm);
    setOriginalForm(null);
    setSyncError('');
    resetFieldErrors();
    setModalOpen(true);
  }, [resetFieldErrors]);

  const openEdit = useCallback((appointment) => {
    const snapshot = {
      name: appointment.name,
      service: appointment.service,
      barber: appointment.barber,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
    };
    setEditingId(appointment.id);
    setForm(snapshot);
    setOriginalForm(snapshot);
    setSyncError('');
    resetFieldErrors();
    setModalOpen(true);
  }, [resetFieldErrors]);

  const closeModal = useCallback(() => {
    if (isSubmitting) return;
    setModalOpen(false);
  }, [isSubmitting]);

  const performDelete = useCallback(async (id) => {
    try {
      await syncRemoveAppointment(dispatch, removeAppointment, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete appointment.');
      throw err;
    }
  }, [dispatch]);

  const {
    deleteConfirmOpen,
    deleteTargetName,
    requestDelete,
    closeDeleteConfirm,
    confirmDelete,
    deleteLoading,
  } = useConfirmDelete(performDelete);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSyncError('');

    if (!runSubmitValidation(form)) {
      return;
    }

    const hasChanges = !editingId || hasFormChanges(form, originalForm, formKeys);

    try {
      await runIfChanged({
        hasChanges,
        onUnchanged: () => setModalOpen(false),
        onChanged: async () => {
          const payload = {
            ...form,
            barber: form.barber || 'No preference',
          };

          if (editingId) {
            const previous = appointments.find((appt) => appt.id === editingId);
            await syncUpdateAppointment(dispatch, updateAppointment, editingId, payload, { previous });
          } else {
            await syncAddAppointment(dispatch, addAppointment, payload);
          }
          setModalOpen(false);
        },
      });
    } catch (err) {
      setSyncError(err.message || 'Failed to save appointment.');
    }
  }, [
    appointments,
    dispatch,
    editingId,
    form,
    originalForm,
    runIfChanged,
    runSubmitValidation,
  ]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      validateOnChange(name, value, next);
      return next;
    });
  }, [validateOnChange]);

  const handleDateChange = useCallback((dateValue) => {
    setForm((prev) => ({ ...prev, date: dateValue, time: '' }));
    clearFieldErrors('date', 'time');
  }, [clearFieldErrors]);

  const handleTimeChange = useCallback((timeValue) => {
    setForm((prev) => ({ ...prev, time: timeValue }));
    clearFieldErrors('time');
  }, [clearFieldErrors]);

  return {
    appointments,
    barbers,
    services,
    modalOpen,
    editingId,
    form,
    fieldErrors,
    syncError,
    openAdd,
    openEdit,
    closeModal,
    handleDelete: requestDelete,
    deleteConfirmOpen,
    deleteTargetName,
    closeDeleteConfirm,
    confirmDelete,
    deleteLoading,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleDateChange,
    handleTimeChange,
  };
}
