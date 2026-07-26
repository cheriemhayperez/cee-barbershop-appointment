import shop from "../../../src/static/shop.json" with { type: "json" };

export const SHOP = {
  name: shop.name,
  phone: shop.phone,
  address: `${shop.address}, ${shop.city}`,
};

export const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
export const SHOP_OWNER_EMAIL = Deno.env.get("SHOP_OWNER_EMAIL");
export const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
export const FROM_NAME = Deno.env.get("FROM_NAME");

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
