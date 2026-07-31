import type { CanjeData, FinanceTotals, InvoiceItem } from '../types/invoice';

interface TotalsOptions {
  discountPct: number;
  taxPct: number;
  aplicaDescuento?: boolean;
  aplicaIva?: boolean;
  canje?: Pick<CanjeData, 'aplicaCanje' | 'valorDescontar' | 'moneda'>;
  /** Cotización Dólar Blue (venta). Requerida si el canje está en ARS. */
  dolarVenta?: number | null;
}

/**
 * Convierte el valor de canje a USD para restarlo del total.
 * Si la moneda es ARS y no hay cotización válida, retorna 0.
 */
export function canjeAmountInUsd(
  canje: Pick<CanjeData, 'aplicaCanje' | 'valorDescontar' | 'moneda'>,
  dolarVenta?: number | null,
): number {
  if (!canje.aplicaCanje || !(canje.valorDescontar > 0)) return 0;

  if (canje.moneda === 'ARS') {
    if (dolarVenta == null || dolarVenta <= 0) return 0;
    return canje.valorDescontar / dolarVenta;
  }

  return canje.valorDescontar;
}

/** Cálculo puro de subtotal, descuento, IVA, canje y total neto (≥ 0). */
export function calculateTotals(
  items: InvoiceItem[],
  options: TotalsOptions,
): FinanceTotals {
  const {
    discountPct,
    taxPct,
    aplicaDescuento = true,
    aplicaIva = true,
    canje = { aplicaCanje: false, valorDescontar: 0, moneda: 'USD' },
    dolarVenta = null,
  } = options;

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const effectiveDiscountPct = aplicaDescuento ? discountPct : 0;
  const effectiveTaxPct = aplicaIva ? taxPct : 0;

  const discountAmount = subtotal * (effectiveDiscountPct / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (effectiveTaxPct / 100);
  const beforeCanje = afterDiscount + taxAmount;
  const canjeAmount = canjeAmountInUsd(canje, dolarVenta);
  const finalTotal = Math.max(0, beforeCanje - canjeAmount);

  return { subtotal, discountAmount, taxAmount, canjeAmount, finalTotal };
}

export function getStatusBadgeClass(status: string): string {
  if (
    status === 'Pagado' ||
    status === 'Reparado / Listo' ||
    status === 'Entregado'
  ) {
    return 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-block';
  }
  if (status === 'En Diagnóstico' || status === 'Esperando Repuesto') {
    return 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold inline-block';
  }
  return 'px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold inline-block';
}

export function getDocBadgeConfig(docType: string): {
  label: string;
  className: string;
} {
  if (docType === 'Soporte') {
    return {
      label: 'ORDEN DE SERVICIO TÉCNICO',
      className:
        'inline-block px-3 py-1 bg-blue-600 text-white text-[11px] font-bold tracking-wider uppercase rounded-md',
    };
  }
  if (docType === 'Presupuesto') {
    return {
      label: 'PRESUPUESTO ESTIMADO',
      className:
        'inline-block px-3 py-1 bg-slate-600 text-white text-[11px] font-bold tracking-wider uppercase rounded-md',
    };
  }
  return {
    label: 'FACTURA DE VENTA',
    className:
      'inline-block px-3 py-1 bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase rounded-md',
  };
}
