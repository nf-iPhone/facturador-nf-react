import Flatpickr from 'react-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { CalendarDays } from 'lucide-react';
import 'flatpickr/dist/flatpickr.min.css';

interface DatePickerFieldProps {
  value: string;
  onChange: (isoDate: string) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  return (
    <div className="relative">
      <Flatpickr
        value={value}
        options={{
          locale: Spanish,
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: 'd/m/Y',
          allowInput: false,
          clickOpens: true,
          altInputClass:
            'w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-9 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer',
        }}
        onChange={(dates) => {
          if (dates[0]) {
            const d = dates[0];
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            onChange(`${y}-${m}-${day}`);
          }
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        placeholder="Seleccionar fecha"
      />
      <CalendarDays
        size={12}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
      />
    </div>
  );
}
