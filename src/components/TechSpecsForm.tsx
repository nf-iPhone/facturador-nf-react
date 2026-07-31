import { Wrench } from 'lucide-react';
import type { TechData } from '../types/invoice';
import { formatModelName, normalizeIPhone } from '../utils/format';

interface TechSpecsFormProps {
  techData: TechData;
  onChange: <K extends keyof TechData>(key: K, value: TechData[K]) => void;
}

export function TechSpecsForm({ techData, onChange }: TechSpecsFormProps) {
  return (
    <div className="space-y-3 bg-blue-950/20 p-3 rounded-xl border border-blue-900/30">
      <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider border-b border-blue-900/50 pb-1 flex items-center justify-between">
        <span>Ficha de Soporte Técnico</span>
        <Wrench size={14} />
      </h2>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Modelo de iPhone/Equipo
            </label>
            <input
              type="text"
              value={techData.model}
              onChange={(e) => onChange('model', formatModelName(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Número de Serie o IMEI
            </label>
            <input
              type="text"
              value={techData.imei}
              onChange={(e) => onChange('imei', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Clave de Acceso/Patrón
            </label>
            <input
              type="text"
              value={techData.code}
              placeholder="Sin código"
              onChange={(e) => onChange('code', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Estado de Batería (%)
            </label>
            <input
              type="text"
              value={techData.battery}
              onChange={(e) => onChange('battery', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Falla Reportada por Cliente
          </label>
          <textarea
            rows={2}
            value={techData.fault}
            onChange={(e) => onChange('fault', normalizeIPhone(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Diagnóstico Técnico y Repuestos
          </label>
          <textarea
            rows={2}
            value={techData.diag}
            onChange={(e) => onChange('diag', normalizeIPhone(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
