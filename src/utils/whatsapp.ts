import type { DocType } from '../types/invoice';
import { getDocBadgeConfig } from './calculations';
import { todayISO } from './format';

/** Deja solo el prefijo + y dígitos (ej: +5491168884097). */
export function cleanPhoneNumber(phone: string): string {
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  const digits = cleaned.replace(/\+/g, '');
  return cleaned.startsWith('+') ? `+${digits}` : digits;
}

function sanitizeFilenamePart(value: string): string {
  return (
    value
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w.\-áéíóúÁÉÍÓÚñÑ]/gi, '')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'SinNombre'
  );
}

export function buildPdfFilename(
  docType: DocType,
  clientName: string,
): string {
  const typePart = sanitizeFilenamePart(docType);
  const namePart = sanitizeFilenamePart(clientName || 'Cliente');
  const datePart = todayISO();
  return `${typePart}_${namePart}_${datePart}.pdf`;
}

export function buildWhatsAppMessage(params: {
  clientName: string;
  docType: DocType;
  total: string;
  emisorName: string;
}): string {
  const docLabel = getDocBadgeConfig(params.docType).label;
  const name = params.clientName.trim() || 'Cliente';
  const emisor = params.emisorName.trim() || 'iPhone NF';

  return (
    `¡Hola *${name}*! 👋` +
    `\n\n` +
    `Te adjuntamos el PDF de tu *${docLabel}* por un total de *${params.total}* de *${emisor}*.` +
    `\n\n` +
    `El archivo PDF se ha descargado automáticamente en tu dispositivo para que lo puedas visualizar y guardar.` +
    `\n\n` +
    `¡Muchas gracias por tu confianza! 🙌`
  );
}

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function openWhatsAppChat(phoneWithPlus: string, message: string): void {
  const phoneDigits = phoneWithPlus.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  const base = isMobileDevice()
    ? 'https://api.whatsapp.com/send'
    : 'https://web.whatsapp.com/send';

  window.open(`${base}?phone=${phoneDigits}&text=${encoded}`, '_blank');
}

/**
 * Genera y descarga el PDF a partir del nodo React (ref de la hoja A4).
 * Recorte estricto (~296mm) + html2canvas con width/height fijos para evitar
 * la 2ª página en blanco por un overflow de unos pocos píxeles.
 */
export async function downloadInvoicePdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default ?? html2pdfModule;

  if (typeof html2pdf !== 'function') {
    throw new Error('No se pudo cargar html2pdf.js correctamente.');
  }

  // Asegura que imágenes (logo) estén listas antes del canvas
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
    ),
  );

  // 1. Guardar estilos originales
  const originalMinHeight = element.style.minHeight;
  const originalHeight = element.style.height;
  const originalMaxHeight = element.style.maxHeight;
  const originalOverflow = element.style.overflow;
  const originalBoxShadow = element.style.boxShadow;
  const originalAspectRatio = element.style.aspectRatio;
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalMargin = element.style.margin;
  const originalPadding = element.style.padding;
  const originalBorder = element.style.border;

  // 2. Forzar dimensiones A4 con 1mm de holgura y recortar desbordes
  element.style.boxSizing = 'border-box';
  element.style.minHeight = '296mm';
  element.style.height = '296mm';
  element.style.maxHeight = '296mm';
  element.style.overflow = 'hidden';
  element.style.boxShadow = 'none';
  element.style.aspectRatio = 'auto';
  element.style.width = '210mm';
  element.style.maxWidth = '210mm';
  element.style.margin = '0';
  element.style.border = 'none';

  // Forzar reflow antes de medir
  void element.offsetHeight;

  const width = element.clientWidth;
  const height = element.clientHeight;

  const opt = {
    margin: 0 as const,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      // Recorte exacto en el borde del elemento (ignora scrollHeight)
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
        clonedElement.style.boxSizing = 'border-box';
        clonedElement.style.aspectRatio = 'auto';
        clonedElement.style.minHeight = '296mm';
        clonedElement.style.height = '296mm';
        clonedElement.style.maxHeight = '296mm';
        clonedElement.style.width = '210mm';
        clonedElement.style.maxWidth = '210mm';
        clonedElement.style.margin = '0';
        clonedElement.style.border = 'none';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.borderRadius = '0';
        clonedElement.style.transform = 'none';
        clonedElement.style.overflow = 'hidden';
      },
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    // Desactivar saltos de página automáticos
    pagebreak: { mode: ['avoid-all'] as string[] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  } finally {
    // 3. Restablecer estilos al instante
    element.style.minHeight = originalMinHeight;
    element.style.height = originalHeight;
    element.style.maxHeight = originalMaxHeight;
    element.style.overflow = originalOverflow;
    element.style.boxShadow = originalBoxShadow;
    element.style.aspectRatio = originalAspectRatio;
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.margin = originalMargin;
    element.style.padding = originalPadding;
    element.style.border = originalBorder;
  }
}
