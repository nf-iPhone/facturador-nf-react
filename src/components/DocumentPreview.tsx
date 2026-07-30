import type { RefObject } from 'react';
import type { InvoiceState } from '../hooks/useInvoiceState';
import { formatCurrency } from '../utils/format';
import { InvoiceSheet } from './InvoiceSheet';

interface DocumentPreviewProps {
  state: InvoiceState;
  printRef: RefObject<HTMLDivElement | null>;
}

export function DocumentPreview({ state, printRef }: DocumentPreviewProps) {
  const {
    docType,
    invoiceData,
    emisorData,
    clientData,
    techData,
    canjeData,
    items,
    totals,
    presupuestos,
    presupuestosGrandTotal,
  } = state;

  const symbol = invoiceData.symbol || '$';
  const isMultiPresupuesto = docType === 'Presupuesto';

  return (
    <main className="flex-1 bg-slate-950 flex justify-center p-3 sm:p-6 md:p-10 overflow-y-auto">
      <div
        id="pdf-content"
        ref={printRef}
        data-multipage={isMultiPresupuesto && presupuestos.length > 0 ? 'true' : 'false'}
        className={
          isMultiPresupuesto
            ? 'w-full max-w-[800px] flex flex-col gap-6'
            : 'w-full max-w-[800px]'
        }
      >
        {isMultiPresupuesto ? (
          presupuestos.length === 0 ? (
            <div className="no-print print-area box-border w-full aspect-[1/1.414] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl shadow-black/40 border border-dashed border-slate-300 flex flex-col items-center justify-center rounded-xl text-center gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Sin presupuestos en el comprobante
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Completá los datos a la izquierda y pulsá{' '}
                <span className="font-semibold text-blue-600">
                  Agregar al comprobante
                </span>{' '}
                para ir sumando presupuestos al PDF.
              </p>
            </div>
          ) : (
            <>
              {presupuestos.map((presupuesto, index) => (
                <InvoiceSheet
                  key={presupuesto.id}
                  docType="Presupuesto"
                  invoiceData={invoiceData}
                  emisorData={emisorData}
                  clientData={clientData}
                  items={presupuesto.items}
                  canje={presupuesto.canje}
                  totals={presupuesto.totals}
                  aplicaDescuento={presupuesto.aplicaDescuento}
                  discountPct={presupuesto.discountPct}
                  aplicaIva={presupuesto.aplicaIva}
                  taxPct={presupuesto.taxPct}
                  pageLabel={`Presupuesto ${index + 1} de ${presupuestos.length}`}
                  className="break-after-page aspect-[1/1.414]"
                />
              ))}

              {presupuestos.length > 1 && (
                <div className="pdf-sheet print-area box-border w-full max-w-[800px] aspect-[1/1.414] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl shadow-black/40 border border-slate-100 flex flex-col justify-between rounded-xl lg:rounded-none break-after-auto">
                  <div className="space-y-6">
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-100 pb-4">
                      Resumen Total del Comprobante
                    </h2>
                    <ul className="space-y-3">
                      {presupuestos.map((p, index) => {
                        const title =
                          p.items[0]?.description.trim() ||
                          `Presupuesto #${index + 1}`;
                        return (
                          <li
                            key={p.id}
                            className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2"
                          >
                            <span className="text-slate-700 font-medium">
                              {index + 1}. {title}
                              {p.canje.aplicaCanje
                                ? ` · Canje: ${p.canje.modeloEntregado}`
                                : ''}
                            </span>
                            <span className="font-bold text-slate-900 shrink-0">
                              {formatCurrency(p.totals.finalTotal, symbol)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="border-t-2 border-slate-100 pt-4 flex justify-between items-center">
                    <span className="text-sm font-extrabold text-slate-900 uppercase">
                      Total general
                    </span>
                    <span className="text-xl font-black text-slate-950">
                      {formatCurrency(presupuestosGrandTotal, symbol)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          <InvoiceSheet
            docType={docType}
            invoiceData={invoiceData}
            emisorData={emisorData}
            clientData={clientData}
            techData={techData}
            items={items}
            canje={canjeData}
            totals={totals}
            showTechSection={docType === 'Soporte'}
            className="aspect-[1/1.414]"
          />
        )}
      </div>
    </main>
  );
}
