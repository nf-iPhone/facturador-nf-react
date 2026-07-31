import { useDolarBlue } from '../hooks/useDolarBlue';
import { formatArs } from '../utils/format';

interface TotalEnPesosProps {
  usdTotal: number;
}

/** Fila de equivalente ARS bajo el total USD, con cotización Dólar Blue (venta). */
export function TotalEnPesos({ usdTotal }: TotalEnPesosProps) {
  const { venta, loading, error } = useDolarBlue();

  if (loading) {
    return (
      <div className="flex justify-between items-center gap-2 pt-1">
        <span className="text-[10px] text-slate-500 font-medium tracking-wide">
          Equiv. en pesos (Blue)
        </span>
        <span className="text-[10px] text-slate-400 italic">Calculando...</span>
      </div>
    );
  }

  if (error || venta === null) {
    return (
      <div className="flex justify-between items-center gap-2 pt-1">
        <span className="text-[10px] text-slate-500 font-medium tracking-wide">
          Equiv. en pesos (Blue)
        </span>
        <span className="text-[10px] text-rose-500/70 font-medium">
          Cotización no disponible
        </span>
      </div>
    );
  }

  const arsTotal = usdTotal * venta;

  return (
    <div className="flex justify-between items-baseline gap-3 pt-1">
      <span className="text-[10px] text-slate-500 font-medium tracking-wide leading-snug">
        Equiv. en pesos
        <span className="text-slate-400">
          {' '}
          (Blue ${venta.toLocaleString('es-AR')})
        </span>
      </span>
      <span className="shrink-0 text-sm text-emerald-700 font-semibold tabular-nums">
        {formatArs(arsTotal)}
      </span>
    </div>
  );
}
