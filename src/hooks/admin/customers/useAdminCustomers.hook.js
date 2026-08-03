import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormFieldErrors } from '@/hooks/shared/useFormFieldErrors.hook';
import { useConfirmDelete } from '@/hooks/shared/useConfirmDelete.hook';
import { useSubmitting } from '@/hooks/shared/useSubmitting.hook';
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
import {
  validateAdminCustomerField,
  validateSubmitAdminCustomer,
} from '@/validations/admin/customers.validate';
import { hasFormChanges } from '@/utils/hasFormChanges';

const emptyForm = { name: '', email: '', phone: '' };
const formKeys = ['name', 'email', 'phone'];

export function useAdminCustomers() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
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
  } = useFormFieldErrors(validateAdminCustomerField, validateSubmitAdminCustomer);

  const openAdd = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm);
    setOriginalForm(null);
    setSyncError('');
    resetFieldErrors();
    setModalOpen(true);
  }, [resetFieldErrors]);

  const openEdit = useCallback((customer) => {
    const snapshot = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    };
    setEditingId(customer.id);
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
      await syncRemoveCustomer(dispatch, removeCustomer, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete customer.');
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

    const payload = editingId
      ? { ...form }
      : { ...form, visits: 0, lastVisit: '' };
    const hasChanges = !editingId || hasFormChanges(form, originalForm, formKeys);

    try {
      await runIfChanged({
        hasChanges,
        onUnchanged: () => setModalOpen(false),
        onChanged: async () => {
          if (editingId) {
            await syncUpdateCustomer(dispatch, updateCustomer, editingId, payload);
          } else {
            await syncAddCustomer(dispatch, addCustomer, payload);
          }
          setModalOpen(false);
        },
      });
    } catch (err) {
      setSyncError(err.message || 'Failed to save customer.');
    }
  }, [
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

  return {
    customers,
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
  };
}
