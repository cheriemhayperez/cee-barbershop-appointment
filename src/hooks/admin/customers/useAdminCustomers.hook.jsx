import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addCustomer,
  removeCustomer,
  updateCustomer,
} from '@/reducers/customers/customers.slice';
import {
  syncAddCustomer,
  syncRemoveCustomer,
  syncUpdateCustomer,
} from '@/services/dataSync';

const emptyForm = { name: '', email: '', phone: '', visits: '0', lastVisit: '' };

export function useAdminCustomers() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
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

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      visits: String(customer.visits),
      lastVisit: customer.lastVisit,
    });
    setSyncError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer ${name}?`)) return;
    try {
      await syncRemoveCustomer(dispatch, removeCustomer, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete customer.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSyncError('');
    const payload = { ...form, visits: Number(form.visits) || 0 };

    try {
      if (editingId) {
        await syncUpdateCustomer(dispatch, updateCustomer, editingId, payload);
      } else {
        await syncAddCustomer(dispatch, addCustomer, payload);
      }
      setModalOpen(false);
    } catch (err) {
      setSyncError(err.message || 'Failed to save customer.');
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    customers,
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
