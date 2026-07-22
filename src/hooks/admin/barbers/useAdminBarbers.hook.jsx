import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { images } from '@/static/shared/images';
import {
  addBarber,
  removeBarber,
  updateBarber,
} from '@/reducers/barbers/barbers.slice';
import {
  syncAddBarber,
  syncRemoveBarber,
  syncUpdateBarber,
} from '@/services/dataSync';

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
  const [syncError, setSyncError] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSyncError('');
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
    setSyncError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete barber ${name}?`)) return;
    try {
      await syncRemoveBarber(dispatch, removeBarber, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete barber.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSyncError('');

    try {
      if (editingId) {
        await syncUpdateBarber(dispatch, updateBarber, editingId, form);
      } else {
        await syncAddBarber(dispatch, addBarber, {
          ...form,
          id: form.name.toLowerCase().replace(/\s+/g, '-'),
          photo: images.barbers[0],
        });
      }
      setModalOpen(false);
    } catch (err) {
      setSyncError(err.message || 'Failed to save barber.');
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    barbers,
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
