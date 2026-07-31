export type DocType = 'Venta' | 'Presupuesto' | 'Soporte';

export type PaymentMethod =
  | 'Efectivo'
  | 'Transferencia Bancaria'
  | 'Tarjeta de Crédito / Débito'
  | 'Mercado Pago'
  | 'A convenir';

export type OrderStatus =
  | 'Pendiente de Pago'
  | 'Pagado'
  | 'En Diagnóstico'
  | 'Esperando Repuesto'
  | 'Reparado / Listo'
  | 'Entregado';

export interface InvoiceItem {
  id: number;
  description: string;
  qty: number;
  price: number;
}

export interface EmisorData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface TechData {
  model: string;
  imei: string;
  code: string;
  battery: string;
  fault: string;
  diag: string;
}

export interface InvoiceData {
  docNum: string;
  docDate: string;
  payment: PaymentMethod;
  status: OrderStatus;
  notes: string;
  warranty: string;
  discountPct: number;
  taxPct: number;
  symbol: string;
  aplicaDescuento: boolean;
  aplicaIva: boolean;
}

export type CanjeMoneda = 'USD' | 'ARS';

/** Equipo entregado en parte de pago (Plan Canje). */
export interface CanjeData {
  aplicaCanje: boolean;
  modeloEntregado: string;
  /** Monto en la moneda indicada por `moneda` (no siempre USD). */
  valorDescontar: number;
  /** Moneda del valor ingresado. El descuento en el total siempre se aplica en USD. */
  moneda: CanjeMoneda;
}

/** Snapshot de un presupuesto agregado al comprobante multipágina. */
export interface Presupuesto {
  id: number;
  items: InvoiceItem[];
  canje: CanjeData;
  aplicaDescuento: boolean;
  discountPct: number;
  aplicaIva: boolean;
  taxPct: number;
  totals: FinanceTotals;
}

export interface FinanceTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  canjeAmount: number;
  finalTotal: number;
}

export interface SocialLink {
  id: 'instagram' | 'tiktok';
  handle: string;
  url: string;
}
