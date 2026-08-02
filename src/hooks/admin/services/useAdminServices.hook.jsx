import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormFieldErrors } from '@/hooks/useFormFieldErrors';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useSubmitting } from '@/hooks/useSubmitting';
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
import {
  validateAdminServiceField,
  validateSubmitAdminService,
} from '@/validations/admin/services.validate';
import { hasFormChanges } from '@/utils/hasFormChanges';

const emptyForm = {
  name: '',
  price: '',
  category: '',
  status: '',
};

const formKeys = ['name', 'price', 'category', 'status'];

export function useAdminServices() {
  const dispatch = useDispatch();
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
  } = useFormFieldErrors(validateAdminServiceField, validateSubmitAdminService);

  const openAdd = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm);
    setOriginalForm(null);
    setSyncError('');
    resetFieldErrors();
    setModalOpen(true);
  }, [resetFieldErrors]);

  const openEdit = useCallback((service) => {
    const snapshot = {
      name: service.name,
      price: service.price,
      category: service.category ?? DEFAULT_SERVICE_CATEGORY,
      status: service.status,
    };
    setEditingId(service.id);
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
      await syncRemoveService(dispatch, removeService, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete service.');
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
            status: form.status || 'active',
          };

          if (editingId) {
            await syncUpdateService(dispatch, updateService, editingId, payload);
          } else {
            await syncAddService(dispatch, addService, payload);
          }
          setModalOpen(false);
        },
      });
    } catch (err) {
      setSyncError(err.message || 'Failed to save service.');
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
  };
}
