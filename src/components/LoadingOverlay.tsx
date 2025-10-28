import { Loader2, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { LoadingState } from '../types';

interface LoadingOverlayProps {
  state: LoadingState;
}

function LoadingOverlay({ state }: LoadingOverlayProps) {
  const getIcon = () => {
    switch (state.step) {
      case 'uploading':
        return <Upload className="w-12 h-12 text-blue-500 animate-bounce" />;
      case 'creating':
        return <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />;
      case 'success':
        return <CheckCircle2 className="w-12 h-12 text-green-500 animate-scaleIn" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500 animate-shake" />;
      default:
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
    }
  };

  const getBackgroundColor = () => {
    switch (state.step) {
      case 'success':
        return 'bg-green-50/95';
      case 'error':
        return 'bg-red-50/95';
      default:
        return 'bg-white/95';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 animate-fadeIn">
      <div className={`${getBackgroundColor()} rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 animate-scaleIn`}>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            {getIcon()}
            {state.step !== 'success' && state.step !== 'error' && (
              <div className="absolute inset-0 rounded-full animate-ping opacity-20">
                <div className="w-full h-full bg-blue-500 rounded-full" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">
              {state.step === 'uploading' && 'Uploading Image'}
              {state.step === 'creating' && 'Creating Market'}
              {state.step === 'success' && 'Success!'}
              {state.step === 'error' && 'Error'}
            </h3>
            <p className="text-slate-600">
              {state.message}
            </p>
          </div>

          {(state.step === 'uploading' || state.step === 'creating') && (
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progressBar" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;
