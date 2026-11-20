// Single source for contact details used in CTAs across the site.
export const WHATSAPP_NUMBER = "919747541006"; // international format, no "+"
export const PHONE_NUMBER = "+919747541006";
export const PHONE_DISPLAY = "+91 97475 41006";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
