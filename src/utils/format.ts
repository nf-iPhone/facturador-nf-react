/** Formatea un monto con símbolo y locale es-AR. */
export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol} ${amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Equivalente en pesos argentinos con símbolo $. */
export function formatArs(amount: number): string {
  return `$ ${amount.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/** Convierte AAAA-MM-DD a DD/MM/AAAA. */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

/** Fecha de hoy en formato AAAA-MM-DD. */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Normaliza cualquier variante de "iphone" / "IPHONE" / "Iphone" a "iPhone"
 * (toda minúscula salvo la P).
 */
export function normalizeIPhone(value: string): string {
  return value.replace(/iphone/gi, 'iPhone');
}

/**
 * Modelo en MAYÚSCULAS, excepto la marca "iPhone"
 * (i minúscula, P mayúscula, resto minúscula).
 * Ej: "iphone 13 pro" → "iPhone 13 PRO"
 */
export function formatModelName(value: string): string {
  return normalizeIPhone(
    value.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/g, (word) => {
      if (/^iphone$/i.test(word)) return 'iPhone';
      if (/^iphone/i.test(word)) {
        return `iPhone${word.slice(6).toUpperCase()}`;
      }
      return word.toUpperCase();
    }),
  );
}


