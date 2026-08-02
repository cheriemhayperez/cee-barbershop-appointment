let cachedShop = null;
const listeners = new Set();

export function setLoadedShop(shop) {
  cachedShop = shop;
  listeners.forEach((listener) => listener(shop));
}

export function subscribeShop(listener) {
  listeners.add(listener);
  if (cachedShop) listener(cachedShop);
  return () => listeners.delete(listener);
}

export function getCachedShop() {
  return cachedShop;
}
