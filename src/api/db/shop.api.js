import { supabase } from '@/lib/supabase';
import defaultShop from '@/static/defaultShop.json';
import { normalizeShopConfig } from '@/utils/shopUtils';

export async function fetchShop() {
  const { data, error } = await supabase
    .from('shop_config')
    .select('config')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
      return normalizeShopConfig(defaultShop);
    }
    throw error;
  }

  if (!data?.config) return normalizeShopConfig(defaultShop);
  return normalizeShopConfig({ ...defaultShop, ...data.config });
}

export async function saveShop(shop) {
  const config = normalizeShopConfig(shop);
  const { error } = await supabase.from('shop_config').upsert({
    id: 1,
    config,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return config;
}
