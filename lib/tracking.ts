// Google Ads + GA4 tracking helpers. gtag.js is loaded in app/layout.tsx.

export const GA_ID = "G-8ZG9Y14V5D";
export const ADS_ID = "AW-18511408363";

// Conversion labels from Google Ads → Goals → Conversions.
const ADS_LABELS = {
  inquiry: "9UqLCKKNubAdEOvZ9vpE", // Inquiry form (primary)
  phone: "W9pPCKWNubAdEOvZ9vpE", // Phone click (secondary)
  email: "ngZzCKiNubAdEOvZ9vpE", // Email click (secondary)
};

type Gtag = (...args: unknown[]) => void;

const gtag: Gtag = (...args) => {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: Gtag };
  w.gtag?.(...args);
};

// Turns a US phone number typed into the form into +1XXXXXXXXXX, or undefined.
const toE164 = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
};

export function trackLead(email: string, phone: string) {
  // Lets Google match the lead to an ad click (enhanced conversions).
  gtag("set", "user_data", {
    email: email.trim().toLowerCase() || undefined,
    phone_number: toE164(phone),
  });
  gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_LABELS.inquiry}` });
  gtag("event", "generate_lead");
}

export function trackPhoneClick() {
  gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_LABELS.phone}` });
  gtag("event", "click_to_call");
}

export function trackEmailClick() {
  gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_LABELS.email}` });
  gtag("event", "click_email");
}
