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
 * Genera y descarga el PDF.
 * - 1 hoja: recorte estricto A4 (evita página en blanco).
 * - Multipágina (varios presupuestos): page-break CSS por cada .pdf-sheet.
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

  const isMultiPage =
    element.dataset.multipage === 'true' ||
    element.querySelectorAll('.pdf-sheet').length > 1;

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
  const originalGap = element.style.gap;

  element.style.boxSizing = 'border-box';
  element.style.boxShadow = 'none';
  element.style.aspectRatio = 'auto';
  element.style.width = '210mm';
  element.style.maxWidth = '210mm';
  element.style.margin = '0';
  element.style.border = 'none';
  element.style.gap = '0';

  if (isMultiPage) {
    element.style.minHeight = 'auto';
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    element.querySelectorAll<HTMLElement>('.pdf-sheet').forEach((sheet) => {
      sheet.style.boxSizing = 'border-box';
      sheet.style.width = '210mm';
      sheet.style.maxWidth = '210mm';
      sheet.style.minHeight = '296mm';
      sheet.style.height = '296mm';
      sheet.style.maxHeight = '296mm';
      sheet.style.overflow = 'hidden';
      sheet.style.boxShadow = 'none';
      sheet.style.borderRadius = '0';
      sheet.style.margin = '0';
      sheet.style.aspectRatio = 'auto';
    });
  } else {
    const sheet =
      element.querySelector<HTMLElement>('.pdf-sheet') ?? element;
    element.style.minHeight = '296mm';
    element.style.height = '296mm';
    element.style.maxHeight = '296mm';
    element.style.overflow = 'hidden';
    sheet.style.minHeight = '296mm';
    sheet.style.height = '296mm';
    sheet.style.maxHeight = '296mm';
    sheet.style.overflow = 'hidden';
    sheet.style.boxShadow = 'none';
  }

  void element.offsetHeight;

  const width = element.clientWidth || 794;
  const height = isMultiPage
    ? Math.max(element.scrollHeight, element.clientHeight)
    : element.clientHeight;

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
      width,
      height: isMultiPage ? undefined : height,
      windowWidth: width,
      windowHeight: isMultiPage ? height : height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
        clonedElement.style.boxSizing = 'border-box';
        clonedElement.style.aspectRatio = 'auto';
        clonedElement.style.width = '210mm';
        clonedElement.style.maxWidth = '210mm';
        clonedElement.style.margin = '0';
        clonedElement.style.border = 'none';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.gap = '0';

        if (isMultiPage) {
          clonedElement.style.height = 'auto';
          clonedElement.style.minHeight = 'auto';
          clonedElement.style.maxHeight = 'none';
          clonedElement.style.overflow = 'visible';
          clonedElement
            .querySelectorAll<HTMLElement>('.pdf-sheet')
            .forEach((sheet) => {
              sheet.style.boxSizing = 'border-box';
              sheet.style.width = '210mm';
              sheet.style.minHeight = '296mm';
              sheet.style.height = '296mm';
              sheet.style.maxHeight = '296mm';
              sheet.style.overflow = 'hidden';
              sheet.style.boxShadow = 'none';
              sheet.style.borderRadius = '0';
              sheet.style.margin = '0';
              sheet.style.pageBreakAfter = 'always';
              sheet.style.breakAfter = 'page';
            });
          const sheets = clonedElement.querySelectorAll<HTMLElement>('.pdf-sheet');
          const last = sheets[sheets.length - 1];
          if (last) {
            last.style.pageBreakAfter = 'auto';
            last.style.breakAfter = 'auto';
          }
        } else {
          clonedElement.style.minHeight = '296mm';
          clonedElement.style.height = '296mm';
          clonedElement.style.maxHeight = '296mm';
          clonedElement.style.overflow = 'hidden';
        }
      },
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    pagebreak: isMultiPage
      ? { mode: ['css', 'legacy'] as string[], after: '.pdf-sheet' }
      : { mode: ['avoid-all'] as string[] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  } finally {
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
    element.style.gap = originalGap;

    element.querySelectorAll<HTMLElement>('.pdf-sheet').forEach((sheet) => {
      sheet.style.minHeight = '';
      sheet.style.height = '';
      sheet.style.maxHeight = '';
      sheet.style.overflow = '';
      sheet.style.boxShadow = '';
      sheet.style.borderRadius = '';
      sheet.style.margin = '';
      sheet.style.width = '';
      sheet.style.maxWidth = '';
      sheet.style.aspectRatio = '';
    });
  }
}
