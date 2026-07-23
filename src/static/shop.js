import shopData from './shop.json';

export const shop = shopData;

export function fullAddress() {
  return `${shop.address}, ${shop.city}`;
}

export function phoneHref() {
  return shop.phone.replace(/\D/g, '');
}

export function mapsEmbedUrl() {
  const query = encodeURIComponent(fullAddress());
  return `https://maps.google.com/maps?q=${query}&output=embed`;
}
