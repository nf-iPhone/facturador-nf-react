import { Mail, MapPin, Phone, Tag, Wrench } from 'lucide-react';
import logoUrl from '../assets/logo.jpeg';
import {
  EMISOR_ADDRESS,
  EMISOR_EMAIL,
  EMISOR_PHONE,
  EMISOR_PHONE_TEL,
  EMISOR_SOCIAL,
} from '../constants/emisor';
import type {
  CanjeData,
  ClientData,
  DocType,
  EmisorData,
  FinanceTotals,
  InvoiceData,
  InvoiceItem,
  TechData,
} from '../types/invoice';
import {
  getDocBadgeConfig,
  getStatusBadgeClass,
} from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/format';
import { InstagramIcon, TikTokIcon } from './BrandIcons';

export interface InvoiceSheetProps {
  docType: DocType;
  invoiceData: InvoiceData;
  emisorData: EmisorData;
  clientData: ClientData;
  techData?: TechData;
  items: InvoiceItem[];
  canje: CanjeData;
  totals: FinanceTotals;
  /** Overrides de descuento/IVA del snapshot (presupuestos). */
  aplicaDescuento?: boolean;
  discountPct?: number;
  aplicaIva?: boolean;
  taxPct?: number;
  /** Etiqueta opcional: "Presupuesto 1 de 3" */
  pageLabel?: string;
  className?: string;
  showTechSection?: boolean;
}

export function InvoiceSheet({
  docType,
  invoiceData,
  emisorData,
  clientData,
  techData,
  items,
  canje,
  totals,
  aplicaDescuento = invoiceData.aplicaDescuento,
  discountPct = invoiceData.discountPct,
  aplicaIva = invoiceData.aplicaIva,
  taxPct = invoiceData.taxPct,
  pageLabel,
  className = '',
  showTechSection = false,
}: InvoiceSheetProps) {
  const symbol = invoiceData.symbol || '$';
  const badge = getDocBadgeConfig(docType);
  const instagram = EMISOR_SOCIAL[0];
  const tiktok = EMISOR_SOCIAL[1];

  return (
    <div
      className={`pdf-sheet print-area box-border w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl shadow-black/40 border border-slate-100 flex flex-col justify-between transition-all rounded-xl lg:rounded-none ${className}`}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-slate-100 pb-6">
          <div className="flex items-center shrink-0">
            <img
              src={logoUrl}
              alt="iPhone NF - Conectamos tu mundo"
              className="h-28 w-28 object-contain rounded-lg"
            />
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className={badge.className}>{badge.label}</span>
            {pageLabel && (
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider pt-1">
                {pageLabel}
              </p>
            )}
            <p className="text-xs text-slate-400 font-medium pt-1">
              Identificador:{' '}
              <span className="text-slate-800 font-semibold">
                {invoiceData.docNum.trim() || '—'}
              </span>
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Fecha:{' '}
              <span className="text-slate-800 font-semibold">
                {formatDate(invoiceData.docDate)}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Emisor
            </h3>
            <p className="text-sm font-bold text-slate-800">
              {emisorData.name || 'iPhone NF'}
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Phone size={10} className="text-slate-400" />
              <a href={EMISOR_PHONE_TEL} className="text-blue-600 hover:underline">
                {EMISOR_PHONE}
              </a>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Mail size={10} className="text-slate-400" />
              <a
                href={`mailto:${EMISOR_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {EMISOR_EMAIL}
              </a>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin size={10} className="text-slate-400" />
              <span>{EMISOR_ADDRESS}</span>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <InstagramIcon size={10} className="text-slate-400" />
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {instagram.handle}
              </a>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <TikTokIcon size={10} className="text-slate-400" />
              <a
                href={tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {tiktok.handle}
              </a>
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Cliente
            </h3>
            <p className="text-sm font-bold text-slate-800">
              {clientData.name || 'Consumidor Final'}
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Tag size={10} className="text-slate-400" /> Tel:{' '}
              <span>{clientData.phone || 'S/D'}</span>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Mail size={10} className="text-slate-400" />
              <span>{clientData.email || 'S/D'}</span>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin size={10} className="text-slate-400" />
              <span>{clientData.address || 'S/D'}</span>
            </p>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                Detalles Generales
              </span>
              <p className="text-xs text-slate-600">
                Método de Pago:{' '}
                <span className="font-semibold text-slate-800">
                  {invoiceData.payment}
                </span>
              </p>
              <p className="text-xs text-slate-600">
                Estado:{' '}
                <span className={getStatusBadgeClass(invoiceData.status)}>
                  {invoiceData.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {showTechSection && techData && (
          <div className="border-2 border-dashed border-slate-200 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Wrench size={14} className="text-blue-600" /> Ficha Técnica del
                Dispositivo
              </h4>
              <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Garantía: {invoiceData.warranty}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase block">
                  Modelo
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {techData.model || 'S/D'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase block">
                  IMEI / Serie
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {techData.imei || 'S/D'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase block">
                  Código de Acceso
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {techData.code || 'S/D'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase block">
                  Condición Batería
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {techData.battery || 'S/D'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Falla Reportada
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {techData.fault || 'S/D'}
                </p>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                  Servicio Realizado / Diagnóstico
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {techData.diag || 'S/D'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-[50%]">
                  Descripción del Producto / Servicio
                </th>
                <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-[15%]">
                  Cant.
                </th>
                <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-[18%]">
                  Precio Unit.
                </th>
                <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-[17%]">
                  Importe
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-xs text-slate-400 italic"
                  >
                    No hay conceptos cargados.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const lineTotal = item.qty * item.price;
                  return (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-3 text-xs text-slate-800 font-medium">
                        {item.description || (
                          <em className="text-slate-400">Sin descripción</em>
                        )}
                      </td>
                      <td className="py-3 text-xs text-slate-600 text-center font-semibold">
                        {item.qty}
                      </td>
                      <td className="py-3 text-xs text-slate-600 text-right">
                        {formatCurrency(item.price, symbol)}
                      </td>
                      <td className="py-3 text-xs text-slate-900 text-right font-semibold">
                        {formatCurrency(lineTotal, symbol)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t-2 border-slate-100 pt-6">
          <div className="flex-1 max-w-[450px] space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Términos del Servicio Técnico y Venta
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {invoiceData.notes}
            </p>
          </div>

          <div className="w-full md:w-[250px] space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Subtotal:</span>
              <span className="text-slate-800">
                {formatCurrency(totals.subtotal, symbol)}
              </span>
            </div>
            {aplicaDescuento && (
              <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                <span>Descuento ({discountPct}%):</span>
                <span>
                  {totals.discountAmount > 0
                    ? `-${formatCurrency(totals.discountAmount, symbol)}`
                    : formatCurrency(0, symbol)}
                </span>
              </div>
            )}
            {aplicaIva && (
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>IVA / Impuesto ({taxPct}%):</span>
                <span>{formatCurrency(totals.taxAmount, symbol)}</span>
              </div>
            )}
            {canje.aplicaCanje && totals.canjeAmount > 0 && (
              <div className="flex justify-between items-start gap-2 text-xs text-rose-600 font-semibold">
                <span className="leading-snug">
                  Plan Canje
                  {canje.modeloEntregado.trim()
                    ? ` (${canje.modeloEntregado.trim()})`
                    : ''}
                  :
                </span>
                <span className="shrink-0">
                  -{formatCurrency(totals.canjeAmount, symbol)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-sm font-extrabold text-slate-900">
              <span className="text-base">TOTAL A PAGAR:</span>
              <span className="text-lg text-slate-950 font-black">
                {formatCurrency(totals.finalTotal, symbol)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-100 pt-6 text-[10px] text-slate-400 font-medium">
          <p>
            Comprobante generado digitalmente. No válido como factura oficial
            según regulaciones locales.
          </p>
          <p className="font-semibold text-slate-600">
            iPhone NF - Conectamos tu mundo ®
          </p>
        </div>
      </div>
    </div>
  );
}
