import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APPOINTMENT_STATUS } from '@/constants/data/appointments.data';
import {
  addAppointment,
  removeAppointment,
  updateAppointment,
} from '@/reducers/appointments/appointments.slice';

const emptyForm = {
  name: '',
  service: 'Classic Cut',
  barber: 'No preference',
  date: '',
  time: '',
  status: APPOINTMENT_STATUS.PENDING,
};

export function useAdminAppointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);
  const barbers = useSelector((state) => state.barbers.barbers);
  const services = useSelector((state) => state.services.services);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
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
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete appointment for ${name}?`)) {
      dispatch(removeAppointment(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateAppointment({ id: editingId, updates: form }));
    } else {
      dispatch(addAppointment(form));
    }
    setModalOpen(false);
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
    openAdd,
    openEdit,
    closeModal,
    handleDelete,
    handleSubmit,
    handleChange,
  };
}
