import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_EMISOR_NAME,
  EMISOR_ADDRESS,
  EMISOR_EMAIL,
  EMISOR_PHONE,
  EMISOR_STORAGE_KEY,
} from '../constants/emisor';
import type {
  CanjeData,
  ClientData,
  DocType,
  EmisorData,
  InvoiceData,
  InvoiceItem,
  OrderStatus,
  PaymentMethod,
  Presupuesto,
  TechData,
} from '../types/invoice';
import { calculateTotals } from '../utils/calculations';
import { todayISO } from '../utils/format';

const EMPTY_ITEM = (): InvoiceItem => ({
  id: 1,
  description: '',
  qty: 1,
  price: 0,
});

const DEFAULT_ITEMS: InvoiceItem[] = [
  {
    id: 1,
    description:
      'Cambio de Módulo de Pantalla Original OLED (iPhone 13 Pro Max)',
    qty: 1,
    price: 180000,
  },
  {
    id: 2,
    description: 'Batería de Alta Capacidad Certificada (Apple Battery Kit Kit)',
    qty: 1,
    price: 50000,
  },
  {
    id: 3,
    description: 'Vidrio Templado Premium de Regalo',
    qty: 1,
    price: 0,
  },
];

const EMPTY_CANJE = (): CanjeData => ({
  aplicaCanje: false,
  modeloEntregado: '',
  valorDescontar: 0,
});

function loadEmisorName(): string {
  try {
    const raw = localStorage.getItem(EMISOR_STORAGE_KEY);
    if (!raw) return DEFAULT_EMISOR_NAME;
    const parsed = JSON.parse(raw) as { name?: string };
    return parsed.name || DEFAULT_EMISOR_NAME;
  } catch {
    return DEFAULT_EMISOR_NAME;
  }
}

export function useInvoiceState() {
  const [docType, setDocType] = useState<DocType>('Venta');

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    docNum: '',
    docDate: todayISO(),
    payment: 'Transferencia Bancaria',
    status: 'Entregado',
    notes:
      'Los repuestos y componentes reemplazados cuentan con la garantía especificada. El equipo debe retirarse dentro de los 30 días posteriores al aviso de reparación, de lo contrario se cobrará recargo por depósito. ¡Gracias por confiar en iPhone NF!',
    warranty: '30 Días',
    discountPct: 5,
    taxPct: 21,
    symbol: '$',
    aplicaDescuento: true,
    aplicaIva: true,
  });

  const [emisorData, setEmisorData] = useState<EmisorData>(() => ({
    name: loadEmisorName(),
    phone: EMISOR_PHONE,
    email: EMISOR_EMAIL,
    address: EMISOR_ADDRESS,
  }));

  const [clientData, setClientData] = useState<ClientData>({
    name: 'Santiago Gómez',
    phone: '+54 9 11 9876-5432',
    email: 'santiago.gomez@gmail.com',
    address: 'Calle San Martín 482, Piso 4B, CABA',
  });

  const [techData, setTechData] = useState<TechData>({
    model: 'iPhone 13 Pro Max (Gris Espacial)',
    imei: '357284910384211',
    code: '1209',
    battery: '84%',
    fault:
      'Daño en módulo táctil tras caída. No da imagen pero vibra al cargarse.',
    diag: 'Cambio de pantalla OLED Original (Calidad Premium) y transferencia de microchip de táctil (IC) para evitar aviso de pieza no original en el sistema.',
  });

  /** Borrador del formulario (ítems + canje del presupuesto en edición). */
  const [items, setItems] = useState<InvoiceItem[]>(DEFAULT_ITEMS);
  const [canjeData, setCanjeData] = useState<CanjeData>(EMPTY_CANJE);

  /** Presupuestos ya agregados al comprobante multipágina. */
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

  useEffect(() => {
    localStorage.setItem(
      EMISOR_STORAGE_KEY,
      JSON.stringify({ name: emisorData.name }),
    );
  }, [emisorData.name]);

  const clearDraftForm = useCallback(() => {
    setItems([EMPTY_ITEM()]);
    setCanjeData(EMPTY_CANJE());
  }, []);

  const changeDocType = useCallback(
    (type: DocType) => {
      setDocType(type);
      if (type === 'Soporte') {
        setInvoiceData((prev) => ({
          ...prev,
          docNum: techData.imei.trim(),
        }));
        setCanjeData((prev) => ({ ...prev, aplicaCanje: false }));
      }
      if (type === 'Presupuesto') {
        // Formulario limpio para ir cargando presupuestos uno a uno
        setItems([EMPTY_ITEM()]);
        setCanjeData(EMPTY_CANJE());
      }
      if (type === 'Venta' && presupuestos.length === 0) {
        setItems(DEFAULT_ITEMS);
      }
    },
    [techData.imei, presupuestos.length],
  );

  const updateInvoiceField = useCallback(
    <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
      setInvoiceData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateEmisorName = useCallback((name: string) => {
    setEmisorData((prev) => ({ ...prev, name }));
  }, []);

  const updateClientField = useCallback(
    <K extends keyof ClientData>(key: K, value: ClientData[K]) => {
      setClientData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateTechField = useCallback(
    <K extends keyof TechData>(key: K, value: TechData[K]) => {
      setTechData((prev) => ({ ...prev, [key]: value }));

      if (key === 'imei' && docType === 'Soporte') {
        setInvoiceData((prev) => ({
          ...prev,
          docNum: String(value).trim(),
        }));
      }
    },
    [docType],
  );

  const addItem = useCallback(() => {
    setItems((prev) => {
      const newId =
        prev.length > 0 ? Math.max(...prev.map((i) => i.id)) + 1 : 1;
      return [...prev, { id: newId, description: '', qty: 1, price: 0 }];
    });
  }, []);

  const deleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback(
    (id: number, field: keyof Omit<InvoiceItem, 'id'>, value: string) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          if (field === 'qty') {
            return { ...item, qty: parseInt(value, 10) || 0 };
          }
          if (field === 'price') {
            return { ...item, price: parseFloat(value) || 0 };
          }
          return { ...item, description: value };
        }),
      );
    },
    [],
  );

  const setPayment = useCallback((payment: PaymentMethod) => {
    setInvoiceData((prev) => ({ ...prev, payment }));
  }, []);

  const setStatus = useCallback((status: OrderStatus) => {
    setInvoiceData((prev) => ({ ...prev, status }));
  }, []);

  const updateCanjeField = useCallback(
    <K extends keyof CanjeData>(key: K, value: CanjeData[K]) => {
      setCanjeData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /** Totales del borrador actual (formulario). */
  const totals = useMemo(
    () =>
      calculateTotals(items, {
        discountPct: invoiceData.discountPct,
        taxPct: invoiceData.taxPct,
        aplicaDescuento: invoiceData.aplicaDescuento,
        aplicaIva: invoiceData.aplicaIva,
        canje: {
          aplicaCanje: canjeData.aplicaCanje,
          valorDescontar: canjeData.valorDescontar,
        },
      }),
    [
      items,
      invoiceData.discountPct,
      invoiceData.taxPct,
      invoiceData.aplicaDescuento,
      invoiceData.aplicaIva,
      canjeData.aplicaCanje,
      canjeData.valorDescontar,
    ],
  );

  const presupuestosGrandTotal = useMemo(
    () => presupuestos.reduce((sum, p) => sum + p.totals.finalTotal, 0),
    [presupuestos],
  );

  const addPresupuesto = useCallback((): boolean => {
    const validItems = items.filter((i) => i.description.trim().length > 0);
    if (validItems.length === 0) {
      window.alert(
        'Agregá al menos un ítem con descripción antes de sumarlo al comprobante.',
      );
      return false;
    }

    if (canjeData.aplicaCanje) {
      if (!canjeData.modeloEntregado.trim()) {
        window.alert('Completá el modelo del equipo entregado en Plan Canje.');
        return false;
      }
      if (!(canjeData.valorDescontar > 0)) {
        window.alert('Ingresá un valor a descontar mayor a 0 en Plan Canje.');
        return false;
      }
    }

    const snapshotItems = validItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    const snapshotTotals = calculateTotals(snapshotItems, {
      discountPct: invoiceData.discountPct,
      taxPct: invoiceData.taxPct,
      aplicaDescuento: invoiceData.aplicaDescuento,
      aplicaIva: invoiceData.aplicaIva,
      canje: {
        aplicaCanje: canjeData.aplicaCanje,
        valorDescontar: canjeData.valorDescontar,
      },
    });

    setPresupuestos((prev) => {
      const newId =
        prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      const next: Presupuesto = {
        id: newId,
        items: snapshotItems,
        canje: { ...canjeData },
        aplicaDescuento: invoiceData.aplicaDescuento,
        discountPct: invoiceData.discountPct,
        aplicaIva: invoiceData.aplicaIva,
        taxPct: invoiceData.taxPct,
        totals: snapshotTotals,
      };
      return [...prev, next];
    });

    clearDraftForm();
    return true;
  }, [items, canjeData, invoiceData, clearDraftForm]);

  const removePresupuesto = useCallback((id: number) => {
    setPresupuestos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
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
    canjeData,
    updateCanjeField,
    items,
    addItem,
    deleteItem,
    updateItem,
    totals,
    presupuestos,
    presupuestosGrandTotal,
    addPresupuesto,
    removePresupuesto,
  };
}

export type InvoiceState = ReturnType<typeof useInvoiceState>;
