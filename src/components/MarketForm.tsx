import { useState, useEffect, FormEvent } from 'react';
import { Plus, X, Image, Calendar, DollarSign, Link, Percent, Shield, Clock } from 'lucide-react';
import type { MarketFormData, Category, Oracle } from '../types';
import CategorySelector from './CategorySelector';

interface MarketFormProps {
  onSubmit: (data: MarketFormData) => void;
  disabled: boolean;
  categories: Category[];
  oracles: Oracle[];
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;
  baseURL: string;
}

function MarketForm({ onSubmit, disabled, categories, oracles, setShowLoginModal }: MarketFormProps) {

  const [formData, setFormData] = useState<MarketFormData>({
    title: '',
    description: '',
    category: 3,
    endDate: '',
    outcomes: ['', ''],
    reference: '',
    initialLiquidity: undefined,
    oracle: 0,
    fee: undefined,
    startAt: undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showStartAt, setShowStartAt] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setShowStartAt((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      setShowLoginModal(true);
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData({ ...formData, outcomes: newOutcomes });
  };

  const addOutcome = () => {
    setFormData({ ...formData, outcomes: [...formData.outcomes, ''] });
  };

  const removeOutcome = (index: number) => {
    if (formData.outcomes.length > 2) {
      const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
      setFormData({ ...formData, outcomes: newOutcomes });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (disabled) {
      setShowLoginModal(true);
      return;
    }

    const validOutcomes = formData.outcomes.filter(o => o.trim());
    if (validOutcomes.length < 2) {
      alert('Please provide at least 2 outcomes');
      return;
    }

    if (formData.fee !== undefined && (formData.fee < 0 || formData.fee > 100)) {
      alert('Fee must be between 0 and 100');
      return;
    }

    onSubmit({
      ...formData,
      outcomes: validOutcomes,
      startAt: showStartAt ? formData.startAt : undefined,
    });

    setShowStartAt(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Question <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Will Bitcoin reach $100k by end of 2025?"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors min-h-32 resize-y"
          placeholder="Detailed description of the prediction market..."
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="w-4 h-4" />
            Category
          </label>
          <CategorySelector
            categories={categories}
            value={formData.category || 3}
            onChange={(slug) => setFormData({ ...formData, category: slug })}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="w-4 h-4" />
            Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
            disabled={disabled}
          />
        </div>
      </div>

      {showStartAt && (
        <div className="animate-fadeIn">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Clock className="w-4 h-4" />
            Start At
          </label>
          <input
            type="datetime-local"
            value={formData.startAt || ''}
            onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
            disabled={disabled}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Link className="w-4 h-4" />
            Reference
          </label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Reference URL or identifier"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <DollarSign className="w-4 h-4" />
            Initial Liquidity
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.initialLiquidity || ''}
            onChange={(e) => setFormData({ ...formData, initialLiquidity: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Optional initial liquidity amount"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Shield className="w-4 h-4" />
            Oracle
          </label>
          <select
            value={formData.oracle}
            onChange={(e) => setFormData({ ...formData, oracle: +e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
            disabled={disabled}
          >
            <option value="">Select an oracle...</option>
            {oracles?.map((oracle) => (
              <option key={oracle.id} defaultChecked={oracle?.id === 0} value={oracle.id}>
                {oracle.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Percent className="w-4 h-4" />
            Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.fee || ''}
            onChange={(e) => setFormData({ ...formData, fee: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="0-100"
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Outcomes <span className="text-red-500">*</span> <span className="text-slate-500 text-xs">(minimum 2)</span>
        </label>
        <div className="space-y-3">
          {formData.outcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => handleOutcomeChange(index, e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder={`Outcome ${index + 1}`}
                disabled={disabled}
              />
              {formData.outcomes.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  disabled={disabled}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOutcome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-medium"
            disabled={disabled}
          >
            <Plus className="w-4 h-4" />
            Add Outcome
          </button>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Image className="w-4 h-4" />
          Market Image
        </label>
        <div className="space-y-3">
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-slate-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData({ ...formData, image: undefined });
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 transition-colors ${disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
            }`}>
            <Image className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {disabled ? 'Login to Upload Image' : (imagePreview ? 'Change Image' : 'Upload Image')}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      {/* Authentication status indicator */}
      {disabled && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <p>You need to log in to create markets. Click "Login to Create Market" below or try uploading an image to open the login modal.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
      >
        {disabled ? 'Login to Create Market' : 'Create Market'}
      </button>
    </form>
  );
}

export default MarketForm;
