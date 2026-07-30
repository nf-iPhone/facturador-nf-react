import { useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface WhatsAppToastProps {
  visible: boolean;
  onClose: () => void;
  durationMs?: number;
}

export function WhatsAppToast({
  visible,
  onClose,
  durationMs = 8000,
}: WhatsAppToastProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [visible, durationMs, onClose]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed bottom-5 right-5 z-[100] max-w-sm w-[calc(100%-2.5rem)] pointer-events-auto"
      style={{
        animation: 'whatsapp-toast-in 280ms ease-out',
      }}
    >
      <div className="relative bg-slate-800 text-white border border-green-500/70 rounded-xl shadow-2xl shadow-black/40 p-4 pr-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>

        <div className="flex gap-3 items-start">
          <div className="shrink-0 mt-0.5 bg-green-600/20 text-green-400 p-2 rounded-lg border border-green-500/30">
            <Info size={16} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-green-400">
              ¡PDF generado!
            </p>
            <p className="text-xs text-slate-200 leading-relaxed">
              Arrastra el archivo descargado desde la barra de descargas de tu
              navegador y suéltalo en el chat de WhatsApp que se acaba de abrir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
