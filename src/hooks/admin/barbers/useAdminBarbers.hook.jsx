import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { uploadBarberPhoto } from '@/api/db/barbers.api';
import { useFormFieldErrors } from '@/hooks/useFormFieldErrors';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useSubmitting } from '@/hooks/useSubmitting';
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
import { readFileAsDataUrl } from '@/utils/readFileAsDataUrl';
import {
  validateAdminBarberField,
  validateSubmitAdminBarber,
} from '@/validations/admin/barbers.validate';
import { hasFormChanges } from '@/utils/hasFormChanges';

const emptyForm = {
  name: '',
  role: '',
  exp: '',
  specialty: '',
  status: '',
  photo: '',
};

const formKeys = ['name', 'role', 'exp', 'specialty', 'status', 'photo'];

export function useAdminBarbers() {
  const dispatch = useDispatch();
  const barbers = useSelector((state) => state.barbers.barbers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [originalForm, setOriginalForm] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [syncError, setSyncError] = useState('');
  const { isSubmitting, runIfChanged } = useSubmitting();
  const {
    fieldErrors,
    resetFieldErrors,
    validateOnChange,
    runSubmitValidation,
  } = useFormFieldErrors(validateAdminBarberField, validateSubmitAdminBarber);

  const resetPhotoState = () => {
    setPhotoFile(null);
    setPhotoError('');
  };

  const openAdd = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm);
    setOriginalForm(null);
    resetPhotoState();
    setSyncError('');
    resetFieldErrors();
    setModalOpen(true);
  }, [resetFieldErrors]);

  const openEdit = useCallback((barber) => {
    const snapshot = {
      name: barber.name,
      role: barber.role,
      exp: barber.exp,
      specialty: barber.specialty,
      status: barber.status,
      photo: barber.photo,
    };
    setEditingId(barber.id);
    setForm(snapshot);
    setOriginalForm(snapshot);
    resetPhotoState();
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
      await syncRemoveBarber(dispatch, removeBarber, id);
    } catch (err) {
      setSyncError(err.message || 'Failed to delete barber.');
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

  const handlePhotoChange = async (file) => {
    setPhotoError('');

    if (!file) {
      setPhotoFile(null);
      setForm((prev) => ({ ...prev, photo: '' }));
      return;
    }

    try {
      const previewUrl = await readFileAsDataUrl(file);
      setPhotoFile(file);
      setForm((prev) => ({ ...prev, photo: previewUrl }));
    } catch (err) {
      setPhotoError(err.message || 'Failed to read image file.');
      setPhotoFile(null);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSyncError('');
    setPhotoError('');

    if (!runSubmitValidation(form)) {
      return;
    }

    const hasChanges = !editingId
      || Boolean(photoFile)
      || hasFormChanges(form, originalForm, formKeys);

    try {
      await runIfChanged({
        hasChanges,
        onUnchanged: () => setModalOpen(false),
        onChanged: async () => {
          const barberId = editingId || form.name.toLowerCase().replace(/\s+/g, '-');
          let photo = form.photo || images.barbers[0];

          if (photoFile) {
            photo = await uploadBarberPhoto(photoFile, barberId);
          }

          const payload = {
            ...form,
            photo,
            status: form.status || 'active',
          };

          if (editingId) {
            await syncUpdateBarber(dispatch, updateBarber, editingId, payload);
          } else {
            await syncAddBarber(dispatch, addBarber, {
              ...payload,
              id: barberId,
            });
          }

          setModalOpen(false);
          resetPhotoState();
        },
      });
    } catch (err) {
      const message = err.message || 'Failed to save barber.';
      if (photoFile) {
        setPhotoError(message);
      } else {
        setSyncError(message);
      }
    }
  }, [
    dispatch,
    editingId,
    form,
    originalForm,
    photoFile,
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
    barbers,
    modalOpen,
    editingId,
    form,
    fieldErrors,
    photoError,
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
    handlePhotoChange,
  };
}
