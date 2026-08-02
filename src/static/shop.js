import shopData from './shop.json';

import {
  buildMapsUrl,
  fullAddress as formatFullAddress,
  mapsEmbedUrl as formatMapsEmbedUrl,
  phoneHref as formatPhoneHref,
} from '@/utils/shopUtils';

export const defaultShop = shopData;
export const shop = shopData;

export function fullAddress(shopInfo = shopData) {
  return formatFullAddress(shopInfo);
}

export function phoneHref(shopInfo = shopData) {
  return formatPhoneHref(shopInfo);
}

export function mapsEmbedUrl(shopInfo = shopData) {
  return formatMapsEmbedUrl(shopInfo);
}

export { buildMapsUrl };
