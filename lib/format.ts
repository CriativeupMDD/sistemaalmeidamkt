export function formatCurrencyFromCents(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(value / 100);
}

export function parseCurrencyToCents(value: FormDataEntryValue | null) {
  const raw = String(value ?? "0")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  return Math.round(Number(raw || 0) * 100);
}

export function toNullableString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}
