import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addCustomer,
  removeCustomer,
  updateCustomer,
} from '@/reducers/customers/customers.slice';

const emptyForm = { name: '', email: '', phone: '', visits: '0', lastVisit: '' };

export function useAdminCustomers() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
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
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete customer ${name}?`)) {
      dispatch(removeCustomer(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, visits: Number(form.visits) || 0 };
    if (editingId) {
      dispatch(updateCustomer({ id: editingId, updates: payload }));
    } else {
      dispatch(addCustomer(payload));
    }
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    customers,
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
