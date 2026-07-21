import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { images } from '@/static/shared/images';
import {
  addBarber,
  removeBarber,
  updateBarber,
} from '@/reducers/barbers/barbers.slice';

const emptyForm = {
  name: '',
  role: 'Barber',
  exp: '',
  specialty: '',
  status: 'active',
};

export function useAdminBarbers() {
  const dispatch = useDispatch();
  const barbers = useSelector((state) => state.barbers.barbers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (barber) => {
    setEditingId(barber.id);
    setForm({
      name: barber.name,
      role: barber.role,
      exp: barber.exp,
      specialty: barber.specialty,
      status: barber.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete barber ${name}?`)) {
      dispatch(removeBarber(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateBarber({ id: editingId, updates: form }));
    } else {
      dispatch(
        addBarber({
          ...form,
          id: form.name.toLowerCase().replace(/\s+/g, '-'),
          photo: images.barbers[0],
        })
      );
    }
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    barbers,
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
