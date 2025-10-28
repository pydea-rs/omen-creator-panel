import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ApiSelector from './components/ApiSelector';
import MarketForm from './components/MarketForm';
import LoadingOverlay from './components/LoadingOverlay';
import Header from './components/Header';
import { uploadImage, createMarket, fetchCategories, fetchOracles } from './services/api';
import type { MarketFormData, LoadingState, Category, Oracle } from './types';

function App() {
  const [baseUrl, setBaseUrl] = useState('https://staging.omenium.app/api');
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [oracles, setOracles] = useState<Oracle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, oraclesData] = await Promise.all([
          fetchCategories(baseUrl),
          fetchOracles(baseUrl),
        ]);
        setCategories(categoriesData);
        setOracles(oraclesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [baseUrl]);

  const handleSubmit = async (formData: MarketFormData) => {
    setResult(null);

    try {
      let imageFilename: string | null = '';
      if (formData.image) {
        setLoadingState({ step: 'uploading', message: 'Uploading the image...' });
        imageFilename = await uploadImage(baseUrl, formData.image);
        if (!imageFilename?.length) {
          throw new Error('Image upload failed! Please try again.');
        }
      }

      setLoadingState({ step: 'creating', message: 'Creating the market...' });
      const { category, oracle, ...marketData } = {
        ...formData,
        image: imageFilename || undefined,
      };
      delete marketData.image;

      await createMarket(baseUrl, { ...marketData, image: imageFilename || undefined, categoryId: category, oracleId: oracle });

      setLoadingState({ step: 'success', message: 'Market created successfully!' });
      setResult({ success: true, message: 'Your prediction market has been created successfully!' });

      setTimeout(() => {
        setLoadingState(null);
      }, 2000);
    } catch (error) {
      setLoadingState({ step: 'error', message: 'Failed to create market' });
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });

      setTimeout(() => {
        setLoadingState(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {loadingState && <LoadingOverlay state={loadingState} />}

      <Header onLoginClick={() => setShowLoginModal(true)} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Prediction Market Creator
          </h1>
          <p className="text-slate-600">
            Create and manage prediction markets with ease
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <ApiSelector baseUrl={baseUrl} onChange={setBaseUrl} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <MarketForm
              onSubmit={handleSubmit}
              disabled={loadingState !== null}
              categories={categories}
              oracles={oracles}
              showLoginModal={showLoginModal}
              setShowLoginModal={setShowLoginModal}
            />
          )}
        </div>

        {result && (
          <div className={`mt-6 p-6 rounded-xl ${result.success
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
            } animate-fadeIn`}>
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle2 className="text-green-600 w-6 h-6" />
              ) : (
                <AlertCircle className="text-red-600 w-6 h-6" />
              )}
              <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
