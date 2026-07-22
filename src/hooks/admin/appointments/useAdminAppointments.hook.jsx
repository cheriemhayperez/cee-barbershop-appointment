import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APPOINTMENT_STATUS } from '@/constants/data/appointments.data';
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

const emptyForm = {
  name: '',
  service: '',
  barber: 'No preference',
  date: '',
  time: '',
  status: APPOINTMENT_STATUS.CONFIRMED,
};

export function useAdminAppointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);
  const barbers = useSelector((state) => state.barbers.barbers);
  const services = useSelector((state) => state.services.services);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [syncError, setSyncError] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSyncError('');
    setModalOpen(true);
  };

  const openEdit = (appointment) => {
    setEditingId(appointment.id);
    setForm({
      name: appointment.name,
      service: appointment.service,
      barber: appointment.barber,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
    });
    setSyncError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete appointment for ${name}?`)) return;
    try {
      await syncRemoveAppointment(dispatch, removeAppointment, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete appointment.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSyncError('');

    try {
      if (editingId) {
        await syncUpdateAppointment(dispatch, updateAppointment, editingId, form);
      } else {
        await syncAddAppointment(dispatch, addAppointment, form);
      }
      setModalOpen(false);
    } catch (err) {
      setSyncError(err.message || 'Failed to save appointment.');
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    appointments,
    barbers,
    services,
    modalOpen,
    editingId,
    form,
    syncError,
    openAdd,
    openEdit,
    closeModal,
    handleDelete,
    handleSubmit,
    handleChange,
  };
}
