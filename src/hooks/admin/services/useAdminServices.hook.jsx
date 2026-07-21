import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addService,
  removeService,
  updateService,
} from '@/reducers/services/services.slice';

const emptyForm = { name: '', price: '', duration: '', status: 'active' };

export function useAdminServices() {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services.services);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
      status: service.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete service "${name}"?`)) {
      dispatch(removeService(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateService({ id: editingId, updates: form }));
    } else {
      dispatch(addService(form));
    }
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
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
