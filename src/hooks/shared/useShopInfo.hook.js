import { useCallback, useEffect, useState } from 'react';

import { SHOP_STORAGE_KEY } from '@/constants';
import { saveShop as saveShopDb } from '@/api/db/shop.api';
import { useSaveStatus } from '@/hooks/shared/useSaveStatus.hook';
import { isSupabaseConfigured } from '@/lib/supabase';
import defaultShop from '@/static/defaultShop.json';
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
  const { saveStatus, saveError, isSaving, withSave } = useSaveStatus();

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

  const updateShop = useCallback(async (nextShop) => {
    return withSave(async () => {
      const saved = await persistShop(nextShop);
      setShop(saved);
      return saved;
    }, 'Failed to save shop info.');
  }, [withSave]);

  return {
    shop,
    loaded,
    isSaving,
    saveStatus,
    saveError,
    updateShop,
  };
}
