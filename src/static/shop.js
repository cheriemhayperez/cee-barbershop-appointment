import shopData from './shop.json';

export const shop = shopData;

export function fullAddress() {
  return `${shop.address}, ${shop.city}`;
}

export function phoneHref() {
  return shop.phone.replace(/\D/g, '');
}
