import { Server } from 'lucide-react';

interface ApiSelectorProps {
  baseUrl: string;
  onChange: (url: string) => void;
}

const API_OPTIONS = [
  { value: 'https://staging.omenium.app/api', label: 'Omenium App (Staging)' },
  { value: 'https://staging.omenium.com/api', label: 'Omenium Com (Staging)' },
];

function ApiSelector({ baseUrl, onChange }: ApiSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Server className="w-4 h-4" />
        API Base URL
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {API_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              baseUrl === option.value
                ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="font-medium text-slate-800">{option.label}</div>
            <div className="text-xs text-slate-500 mt-1 font-mono truncate">
              {option.value}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ApiSelector;
