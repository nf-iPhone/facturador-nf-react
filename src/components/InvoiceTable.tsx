import { PlusCircle } from 'lucide-react';
import type { InvoiceItem } from '../types/invoice';
import { InvoiceItemRow } from './InvoiceItemRow';

interface InvoiceTableProps {
  items: InvoiceItem[];
  onAdd: () => void;
  onUpdate: (
    id: number,
    field: keyof Omit<InvoiceItem, 'id'>,
    value: string,
  ) => void;
  onDelete: (id: number) => void;
}

export function InvoiceTable({
  items,
  onAdd,
  onUpdate,
  onDelete,
}: InvoiceTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-1">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Conceptos / Ítems
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
        >
          <PlusCircle size={14} /> Agregar Ítem
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
            No hay ningún ítem cargado. Añade uno.
          </div>
        ) : (
          items.map((item, index) => (
            <InvoiceItemRow
              key={item.id}
              item={item}
              index={index}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
