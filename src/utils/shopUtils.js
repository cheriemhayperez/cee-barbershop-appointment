export function fullAddress(shop) {
  if (!shop?.address) return shop?.city ?? '';
  if (!shop?.city) return shop.address;
  return `${shop.address}, ${shop.city}`;
}

export function phoneHref(shop) {
  return String(shop?.phone ?? '').replace(/\D/g, '');
}

export function buildMapsUrl(shop) {
  const query = encodeURIComponent(fullAddress(shop).replace(/, /g, ' '));
  return `https://maps.google.com/?q=${query}`;
}

export function mapsEmbedUrl(shop) {
  const query = encodeURIComponent(fullAddress(shop));
  return `https://maps.google.com/maps?q=${query}&output=embed`;
}

export function normalizeShopConfig(shop) {
  return {
    name: shop?.name?.trim() ?? '',
    address: shop?.address?.trim() ?? '',
    city: shop?.city?.trim() ?? '',
    footerLocation: shop?.footerLocation?.trim() ?? shop?.city?.trim() ?? '',
    phone: shop?.phone?.trim() ?? '',
    email: shop?.email?.trim() ?? '',
    mapsUrl: shop?.mapsUrl?.trim() || buildMapsUrl(shop),
  };
}
