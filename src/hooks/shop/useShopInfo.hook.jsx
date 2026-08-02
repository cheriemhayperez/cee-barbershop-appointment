import { useCallback, useEffect, useRef, useState } from 'react';

import { SHOP_STORAGE_KEY } from '@/constants/data/shop.data';
import { saveShop as saveShopDb } from '@/api/db/shop.api';
import { isSupabaseConfigured } from '@/lib/supabase';
import defaultShop from '@/static/shop.json';
import { subscribeShop } from '@/utils/shopBus';
import { normalizeShopConfig } from '@/utils/shopUtils';

function loadLocalShop() {
  try {
    const raw = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return normalizeShopConfig(defaultShop);
    return normalizeShopConfig({ ...defaultShop, ...JSON.parse(raw) });
  } catch {
    return normalizeShopConfig(defaultShop);
  }
}

function saveLocalShop(shop) {
  localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(shop));
}

function notifyShopUpdated() {
  window.dispatchEvent(new Event('cb-shop-updated'));
}

async function persistShop(shop) {
  const nextShop = normalizeShopConfig(shop);

  if (isSupabaseConfigured) {
    await saveShopDb(nextShop);
  } else {
    saveLocalShop(nextShop);
  }

  notifyShopUpdated();
  return nextShop;
}

export function useShopInfo() {
  const [shop, setShop] = useState(() => normalizeShopConfig(defaultShop));
  const [loaded, setLoaded] = useState(!isSupabaseConfigured);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState(null);
  const savedTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setShop(loadLocalShop());
      setLoaded(true);
      return;
    }

    const unsubscribe = subscribeShop((loadedShop) => {
      setShop(normalizeShopConfig(loadedShop));
      setLoaded(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const sync = () => {
      if (!isSupabaseConfigured) {
        setShop(loadLocalShop());
      }
    };

    window.addEventListener('cb-shop-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cb-shop-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => () => {
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
  }, []);

  const markSaved = useCallback(() => {
    setSaveStatus('saved');
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

  const updateShop = useCallback(async (nextShop) => {
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const saved = await persistShop(nextShop);
      setShop(saved);
      markSaved();
      return saved;
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err?.message || 'Failed to save shop info.');
      throw err;
    }
  }, [markSaved]);

  return {
    shop,
    loaded,
    isSaving: saveStatus === 'saving',
    saveStatus,
    saveError,
    updateShop,
  };
}
