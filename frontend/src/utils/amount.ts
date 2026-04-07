export function parseLocalizedAmount(raw: string): number {
  const value = raw.trim().replace(/\s+/g, "");
  if (!value) return Number.NaN;

  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) {
      return Number(value.replace(/\./g, "").replace(",", "."));
    }
    return Number(value.replace(/,/g, ""));
  }

  if (lastComma > -1) {
    return Number(value.replace(",", "."));
  }

  if ((value.match(/\./g) || []).length > 1) {
    return Number(value.replace(/\./g, ""));
  }

  if (lastDot > -1) {
    const fraction = value.slice(lastDot + 1);
    if (/^\d{3}$/.test(fraction)) {
      return Number(value.replace(".", ""));
    }
  }

  return Number(value);
}
