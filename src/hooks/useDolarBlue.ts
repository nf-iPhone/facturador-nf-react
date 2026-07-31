import { useEffect, useState } from 'react';

/** Respuesta de https://dolarapi.com/v1/dolares/blue */
export interface DolarBlueResponse {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface UseDolarBlueResult {
  venta: number | null;
  loading: boolean;
  error: string | null;
}

const DOLAR_BLUE_URL = 'https://dolarapi.com/v1/dolares/blue';
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedVenta: number | null = null;
let cachedAt = 0;
let inflight: Promise<number> | null = null;

async function fetchDolarBlueVenta(): Promise<number> {
  const now = Date.now();
  if (cachedVenta !== null && now - cachedAt < CACHE_TTL_MS) {
    return cachedVenta;
  }

  if (inflight) return inflight;

  inflight = fetch(DOLAR_BLUE_URL)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as DolarBlueResponse;
      if (typeof data.venta !== 'number' || Number.isNaN(data.venta)) {
        throw new Error('Respuesta inválida de la API');
      }
      cachedVenta = data.venta;
      cachedAt = Date.now();
      return data.venta;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/**
 * Cotización en tiempo real del Dólar Blue (venta).
 * Comparte caché entre montajes para no spamear la API en PDFs multipágina.
 */
export function useDolarBlue(): UseDolarBlueResult {
  const [venta, setVenta] = useState<number | null>(cachedVenta);
  const [loading, setLoading] = useState<boolean>(cachedVenta === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(cachedVenta === null);
    setError(null);

    fetchDolarBlueVenta()
      .then((value) => {
        if (cancelled) return;
        setVenta(value);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error('Error al obtener Dólar Blue:', err);
        setError('No se pudo obtener la cotización');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { venta, loading, error };
}
