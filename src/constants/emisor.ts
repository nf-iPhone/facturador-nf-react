import type { SocialLink } from '../types/invoice';

export const EMISOR_PHONE = '+54 9 11 6888-4097';
export const EMISOR_EMAIL = 'nf@iphonesnf.com';
export const EMISOR_ADDRESS =
  'Limay 1238, oficina 27. San Antonio de Padua, Buenos Aires';
export const EMISOR_PHONE_TEL = 'tel:+5491168884097';

export const DEFAULT_EMISOR_NAME = 'iPhone NF - Venta & Servicio Técnico';

export const EMISOR_SOCIAL: SocialLink[] = [
  {
    id: 'instagram',
    handle: 'iphonee.nf',
    url: 'https://www.instagram.com/iphonee.nf/',
  },
  {
    id: 'tiktok',
    handle: 'iphonee.nf',
    url: 'https://www.tiktok.com/@iphonee.nf',
  },
];

export const EMISOR_STORAGE_KEY = 'iphoneNF_emisor';

export const PAYMENT_OPTIONS = [
  'Efectivo',
  'Transferencia Bancaria',
  'Tarjeta de Crédito / Débito',
  'Mercado Pago',
  'A convenir',
] as const;

export const STATUS_OPTIONS = [
  'Pendiente de Pago',
  'Pagado',
  'En Diagnóstico',
  'Esperando Repuesto',
  'Reparado / Listo',
  'Entregado',
] as const;
