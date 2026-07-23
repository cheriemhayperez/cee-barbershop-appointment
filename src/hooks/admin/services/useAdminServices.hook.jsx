import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addService,
  removeService,
  updateService,
} from '@/reducers/services/services.slice';
import {
  syncAddService,
  syncRemoveService,
  syncUpdateService,
} from '@/services/dataSync';
import {
  DEFAULT_SERVICE_CATEGORY,
} from '@/static/customer/serviceCatalog';

const emptyForm = {
  name: '',
  price: '',
  category: DEFAULT_SERVICE_CATEGORY,
  status: 'active',
};

export function useAdminServices() {
  const dispatch = useDispatch();
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

  const openEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      price: service.price,
      category: service.category ?? DEFAULT_SERVICE_CATEGORY,
      status: service.status,
    });
    setSyncError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete service "${name}"?`)) return;
    try {
      await syncRemoveService(dispatch, removeService, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete service.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSyncError('');

    try {
      if (editingId) {
        await syncUpdateService(dispatch, updateService, editingId, form);
      } else {
        await syncAddService(dispatch, addService, form);
      }
      setModalOpen(false);
    } catch (err) {
      setSyncError(err.message || 'Failed to save service.');
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
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
