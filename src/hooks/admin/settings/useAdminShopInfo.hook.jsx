import { useCallback, useEffect, useState } from 'react';

import { useSubmitting } from '@/hooks/useSubmitting';
import { useShopInfo } from '@/hooks/shop/useShopInfo.hook';
import { hasFormChanges } from '@/utils/hasFormChanges';

const formKeys = ['name', 'address', 'city', 'footerLocation', 'phone', 'email'];

const emptyForm = {
  name: '',
  address: '',
  city: '',
  footerLocation: '',
  phone: '',
  email: '',
};

function shopToForm(shop) {
  return {
    name: shop.name ?? '',
    address: shop.address ?? '',
    city: shop.city ?? '',
    footerLocation: shop.footerLocation ?? '',
    phone: shop.phone ?? '',
    email: shop.email ?? '',
  };
}

function validateShopForm(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Shop name is required';
  if (!form.address.trim()) errors.address = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.phone.trim()) errors.phone = 'Phone is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email';
  }

  return errors;
}

export function useAdminShopInfo() {
  const { shop, loaded, isSaving, saveStatus, saveError, updateShop } = useShopInfo();
  const [form, setForm] = useState(emptyForm);
  const [originalForm, setOriginalForm] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [syncError, setSyncError] = useState('');
  const { isSubmitting, withSubmitting } = useSubmitting();

  useEffect(() => {
    if (!loaded) return;
    const snapshot = shopToForm(shop);
    setForm(snapshot);
    setOriginalForm(snapshot);
  }, [loaded, shop]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSyncError('');
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const errors = validateShopForm(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    if (!hasFormChanges(form, originalForm, formKeys)) {
      return;
    }

    await withSubmitting(async () => {
      try {
        await updateShop(form);
        const snapshot = { ...form };
        setOriginalForm(snapshot);
        setSyncError('');
      } catch (err) {
        setSyncError(err?.message || 'Failed to save shop info.');
      }
    });
  }, [form, originalForm, updateShop, withSubmitting]);

  const busy = isSaving || isSubmitting;
  const hasChanges = hasFormChanges(form, originalForm, formKeys);

  return {
    shop,
    loaded,
    form,
    fieldErrors,
    syncError,
    saveStatus,
    saveError,
    isSaving: busy,
    hasChanges,
    handleChange,
    handleSubmit,
  };
}
