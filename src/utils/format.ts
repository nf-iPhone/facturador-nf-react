/** Formatea un monto con símbolo y locale es-AR. */
export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol} ${amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
