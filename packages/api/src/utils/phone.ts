export function validateUKPhone(phone: string): boolean {
  const e164UK = /^\+44[1-9]\d{9}$/;
  const localUK = /^0[1-9]\d{9}$/;
  return e164UK.test(phone) || localUK.test(phone);
}

export function normaliseToE164(phone: string): string {
  const digits = phone.replace(/\s+/g, "");
  if (digits.startsWith("+44")) return digits;
  if (digits.startsWith("0")) return "+44" + digits.slice(1);
  return digits;
}
