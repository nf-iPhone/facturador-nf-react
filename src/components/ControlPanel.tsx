import { FileText, MessageCircle, Printer } from 'lucide-react';
import {
  EMISOR_ADDRESS,
  EMISOR_EMAIL,
  EMISOR_PHONE,
  EMISOR_SOCIAL,
  PAYMENT_OPTIONS,
  STATUS_OPTIONS,
} from '../constants/emisor';
import type { InvoiceState } from '../hooks/useInvoiceState';
import type { DocType, OrderStatus, PaymentMethod } from '../types/invoice';
import { InstagramIcon, TikTokIcon } from './BrandIcons';
import { DatePickerField } from './DatePickerField';
import { InvoiceTable } from './InvoiceTable';
import { TechSpecsForm } from './TechSpecsForm';

interface ControlPanelProps {
  state: InvoiceState;
  onSendWhatsApp: () => void;
  isSendingWhatsApp?: boolean;
}

const DOC_TABS: { type: DocType; label: string }[] = [
  { type: 'Venta', label: 'Factura' },
  { type: 'Presupuesto', label: 'Presupuesto' },
  { type: 'Soporte', label: 'S. Técnico' },
];

export function ControlPanel({
  state,
  onSendWhatsApp,
  isSendingWhatsApp = false,
}: ControlPanelProps) {
  const {
    docType,
    changeDocType,
    invoiceData,
    updateInvoiceField,
    setPayment,
    setStatus,
    emisorData,
    updateEmisorName,
    clientData,
    updateClientField,
    techData,
    updateTechField,
    items,
    addItem,
    deleteItem,
    updateItem,
  } = state;

  return (
    <aside className="no-print w-full lg:w-[420px] bg-slate-800 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col h-auto lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
      {/* Cabecera */}
      <div className="p-5 border-b border-slate-700 bg-slate-800/50 sticky top-0 backdrop-blur z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <FileText size={18} />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white">
              iPhone NF
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Panel de Documentos v2.0
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 transition-colors text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
          >
            <Printer size={14} /> Imprimir / PDF
          </button>
          <button
            type="button"
            onClick={onSendWhatsApp}
            disabled={isSendingWhatsApp}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-green-950/20"
          >
            <MessageCircle size={14} />
            {isSendingWhatsApp ? 'Generando PDF…' : 'Enviar por WhatsApp'}
          </button>
        </div>
      </div>

      {/* Pestañas de tipo */}
      <div className="px-5 pt-4">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Tipo de Documento
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl">
          {DOC_TABS.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => changeDocType(type)}
              className={
                docType === type
                  ? 'text-xs py-2 px-1 rounded-lg font-medium transition-all text-white bg-blue-600'
                  : 'text-xs py-2 px-1 rounded-lg font-medium transition-all text-slate-400 hover:text-white'
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Datos del Documento */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-1">
            Datos del Documento
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Identificador (IMEI u otro)
              </label>
              <input
                type="text"
                value={invoiceData.docNum}
                placeholder="Ej: 357284910384211"
                onChange={(e) => updateInvoiceField('docNum', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Fecha de Emisión
              </label>
              <DatePickerField
                value={invoiceData.docDate}
                onChange={(date) => updateInvoiceField('docDate', date)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Método de Pago
              </label>
              <select
                value={invoiceData.payment}
                onChange={(e) =>
                  setPayment(e.target.value as PaymentMethod)
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {PAYMENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'Transferencia Bancaria' ? 'Transferencia' : opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Estado de Orden
              </label>
              <select
                value={invoiceData.status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Emisor */}
        <div className="space-y-3 bg-slate-900/30 p-3 rounded-xl border border-slate-700/30">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-1">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Datos del Emisor
            </h2>
            <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
              Se Autoguardan
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Nombre Comercial / Dueño
              </label>
              <input
                type="text"
                value={emisorData.name}
                onChange={(e) => updateEmisorName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  value={EMISOR_PHONE}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  value={EMISOR_EMAIL}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Dirección / Local comercial
              </label>
              <input
                type="text"
                value={EMISOR_ADDRESS}
                readOnly
                className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] text-slate-400 mb-1">
                Redes
              </label>
              {EMISOR_SOCIAL.map((social) => (
                <div
                  key={social.id}
                  className="flex items-center gap-2 bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-1.5"
                >
                  {social.id === 'instagram' ? (
                    <InstagramIcon size={12} className="text-pink-400" />
                  ) : (
                    <TikTokIcon size={12} className="text-slate-300" />
                  )}
                  <span className="text-xs text-slate-300">{social.handle}</span>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-[10px] text-blue-400 hover:text-blue-300"
                  >
                    Abrir
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-1">
            Datos del Cliente
          </h2>
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={clientData.name}
                onChange={(e) => updateClientField('name', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={clientData.phone}
                  onChange={(e) => updateClientField('phone', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => updateClientField('email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Dirección (Opcional)
              </label>
              <input
                type="text"
                value={clientData.address}
                onChange={(e) => updateClientField('address', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Ficha técnica (condicional) */}
        {docType === 'Soporte' && (
          <TechSpecsForm techData={techData} onChange={updateTechField} />
        )}

        {/* Ítems */}
        <InvoiceTable
          items={items}
          onAdd={addItem}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />

        {/* Totales */}
        <div className="space-y-3 bg-slate-900/30 p-3 rounded-xl border border-slate-700/30">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-1">
            Configuración de Totales
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                value={invoiceData.discountPct}
                min={0}
                max={100}
                onChange={(e) =>
                  updateInvoiceField(
                    'discountPct',
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                IVA / Impuesto (%)
              </label>
              <input
                type="number"
                value={invoiceData.taxPct}
                min={0}
                max={100}
                onChange={(e) =>
                  updateInvoiceField('taxPct', parseFloat(e.target.value) || 0)
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Moneda / Símbolo
              </label>
              <input
                type="text"
                value={invoiceData.symbol}
                onChange={(e) => updateInvoiceField('symbol', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Garantía Ofrecida
              </label>
              <input
                type="text"
                value={invoiceData.warranty}
                onChange={(e) =>
                  updateInvoiceField('warranty', e.target.value)
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-1">
            Notas / Términos del Servicio
          </h2>
          <textarea
            rows={3}
            value={invoiceData.notes}
            onChange={(e) => updateInvoiceField('notes', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-y"
          />
        </div>
      </div>
    </aside>
  );
}
