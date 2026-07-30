import { useCallback, useRef, useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { DocumentPreview } from './components/DocumentPreview';
import { WhatsAppToast } from './components/WhatsAppToast';
import { useInvoiceState } from './hooks/useInvoiceState';
import { formatCurrency } from './utils/format';
import {
  buildPdfFilename,
  buildWhatsAppMessage,
  cleanPhoneNumber,
  downloadInvoicePdf,
  openWhatsAppChat,
} from './utils/whatsapp';

function App() {
  const state = useInvoiceState();
  const printRef = useRef<HTMLDivElement>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [showWhatsAppToast, setShowWhatsAppToast] = useState(false);

  const handleCloseToast = useCallback(() => {
    setShowWhatsAppToast(false);
  }, []);

  const handleSendWhatsApp = useCallback(async () => {
    const phone = cleanPhoneNumber(state.clientData.phone);
    const phoneDigits = phone.replace(/\D/g, '');

    if (!phoneDigits) {
      window.alert(
        'Ingresá el teléfono del cliente (con prefijo internacional, ej: +54 9 11 …) para enviarlo por WhatsApp.',
      );
      return;
    }

    // Siempre usar el ref de React (hoja A4), no getElementById
    const sheet = printRef.current;
    if (!sheet) {
      window.alert(
        'No se pudo acceder a la vista previa del comprobante. Recargá la página e intentá de nuevo.',
      );
      return;
    }

    const filename = buildPdfFilename(state.docType, state.clientData.name);
    const total = formatCurrency(
      state.totals.finalTotal,
      state.invoiceData.symbol || '$',
    );
    const message = buildWhatsAppMessage({
      clientName: state.clientData.name,
      docType: state.docType,
      total,
      emisorName: state.emisorData.name,
    });

    setIsSendingWhatsApp(true);
    try {
      // Pequeña pausa para que el DOM pinte el estado "Generando…" y el layout esté estable
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      await downloadInvoicePdf(sheet, filename);
      openWhatsAppChat(phone, message);
      setShowWhatsAppToast(true);
    } catch (error) {
      console.error('Error al generar PDF / abrir WhatsApp:', error);
      const detail =
        error instanceof Error ? error.message : 'Error desconocido';
      window.alert(
        `Ocurrió un error al generar el PDF.\n\nDetalle: ${detail}\n\nPodés reintentar o usar Imprimir / PDF.`,
      );
    } finally {
      setIsSendingWhatsApp(false);
    }
  }, [state]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <ControlPanel
        state={state}
        onSendWhatsApp={handleSendWhatsApp}
        isSendingWhatsApp={isSendingWhatsApp}
      />
      <DocumentPreview state={state} printRef={printRef} />
      <WhatsAppToast
        visible={showWhatsAppToast}
        onClose={handleCloseToast}
        durationMs={8000}
      />
    </div>
  );
}

export default App;
