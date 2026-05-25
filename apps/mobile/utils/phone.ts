export function validateUKPhone(phone: string): boolean {
  const e164UK = /^\+44[1-9]\d{9}$/;
  const localUK = /^0[1-9]\d{9}$/;
  return e164UK.test(phone.replace(/\s/g, "")) || localUK.test(phone.replace(/\s/g, ""));
}

export function formatDisplay(phone: string): string {
  const normalised = phone.replace(/\s/g, "");
  if (normalised.startsWith("+44")) {
    const local = "0" + normalised.slice(3);
    return local.replace(/(\d{5})(\d{6})/, "$1 $2");
  }
  return phone.replace(/(\d{5})(\d{6})/, "$1 $2");
}
