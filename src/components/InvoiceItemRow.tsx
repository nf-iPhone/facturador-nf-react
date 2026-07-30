import { Trash2 } from 'lucide-react';
import type { InvoiceItem } from '../types/invoice';

interface InvoiceItemRowProps {
  item: InvoiceItem;
  index: number;
  onUpdate: (
    id: number,
    field: keyof Omit<InvoiceItem, 'id'>,
    value: string,
  ) => void;
  onDelete: (id: number) => void;
}

export function InvoiceItemRow({
  item,
  index,
  onUpdate,
  onDelete,
}: InvoiceItemRowProps) {
  return (
    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400">
          Concepto #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-300 text-xs transition-colors"
          aria-label={`Eliminar concepto ${index + 1}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
      <input
        type="text"
        value={item.description}
        placeholder="Descripción (ej: Cambio de Módulo)"
        onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">
            Cantidad
          </label>
          <input
            type="number"
            value={item.qty}
            min={1}
            onChange={(e) => onUpdate(item.id, 'qty', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">
            Precio Unitario
          </label>
          <input
            type="number"
            value={item.price}
            min={0}
            step="any"
            onChange={(e) => onUpdate(item.id, 'price', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
