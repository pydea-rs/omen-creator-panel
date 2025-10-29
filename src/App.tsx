import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import ApiSelector from "./components/ApiSelector";
import MarketForm from "./components/MarketForm";
import LoadingOverlay from "./components/LoadingOverlay";
import Header from "./components/Header";
import {
  uploadImage,
  createMarket,
  fetchCategories,
  fetchOracles,
} from "./services/api";
import type { MarketFormData, LoadingState, Category, Oracle } from "./types";
import LoginModal from "./components/LoginModal";
import { useAuth } from "./hooks/useAuth";
import { AxiosError } from "axios";

function App() {
  const [baseUrl, setBaseUrl] = useState("https://staging.omenium.app/api");
  const {
    login,
    loading: loginLoading,
    token: accessToken,
    isAuthenticated,
    logout,
  } = useAuth(baseUrl);
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string[];
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [oracles, setOracles] = useState<Oracle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Don't auto-show login modal - let user trigger it manually

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
        setShowLoginModal(!isAuthenticated);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [baseUrl, isAuthenticated]);

  const handleSubmit = async (formData: MarketFormData) => {
    setResult(null);

    try {
      let imageFilename: string | null = "";
      if (!accessToken?.length) {
        logout();
        throw new Error(
          "There was a conflict in your authentication state! Please login again first."
        );
      }

      if (formData.image) {
        setLoadingState({
          step: "uploading",
          message: "Uploading the image...",
        });
        imageFilename = await uploadImage(baseUrl, formData.image, accessToken);
        if (!imageFilename?.length) {
          throw new Error("Image upload failed! Please try again.");
        }
      }

      setLoadingState({ step: "creating", message: "Creating the market..." });
      const { category, oracle, ...marketData } = {
        ...formData,
        image: imageFilename || undefined,
      };
      delete marketData.image;
      if (!marketData.resolveAt) {
        throw new Error("Resolving date (deadline) is required");
      }
      await createMarket(
        baseUrl,
        {
          ...marketData,
          outcomes: formData.outcomes.map((outcome) => ({
            title: outcome,
          })),
          image: imageFilename || undefined,
          categoryId: category,
          oracleId: oracle,
        },
        accessToken
      );

      setLoadingState({
        step: "success",
        message: "Market created successfully!",
      });
      setResult({
        success: true,
        message: ["Your prediction market has been created successfully!"],
      });

      setTimeout(() => {
        setLoadingState(null);
      }, 2000);
      return true;
    } catch (error) {
      setLoadingState({ step: "error", message: "Failed to create market" });
      if (!(error instanceof AxiosError)) {
        setResult({
          success: false,
          message: [
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          ],
        });
      } else {
        if (error.status === 401) {
          logout();
          setResult({
            success: false,
            message: [
              "Your login session seems to be invalid or expired. Please login again...",
            ],
          });
        } else if (
          error.status === 400 &&
          error.response?.data?.message?.toLowerCase() ===
            "validation exception"
        ) {
          const message = ["Invalid Input! "];
          const fieldProblems = Object.entries(
            error.response?.data?.fields || {}
          );
          if (fieldProblems.length) {
            message.push(
              ...fieldProblems.map(([field, issues]) => {
                const issue = issues instanceof Array ? issues[0] : issues;
                return `\n* ${field}: ${Object.values(issue ?? {})?.[0]}`;
              })
            );
          }
          setResult({
            success: false,
            message,
          });
        } else {
          setResult({
            success: false,
            message: [
              error.response?.data?.message ||
                error.message ||
                "An unexpected error occurred",
            ],
          });
        }
      }
      setTimeout(() => {
        setLoadingState(null);
      }, 3000);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {loadingState && <LoadingOverlay state={loadingState} />}

      <Header
        onLoginClick={() => setShowLoginModal(true)}
        isAuthenticated={isAuthenticated}
        isLoading={loginLoading}
        onLogout={logout}
      />

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
            <>
              <MarketForm
                onSubmit={handleSubmit}
                disabled={
                  Boolean(loadingState) || loginLoading || !isAuthenticated
                }
                categories={categories}
                oracles={oracles}
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
                baseURL={baseUrl}
              />
              <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={(username: string, password: string) =>
                  login(baseUrl, username, password)
                }
              />
            </>
          )}
        </div>

        {result && (
          <div
            className={`mt-6 p-6 rounded-xl ${
              result.success
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            } animate-fadeIn`}
          >
            {result.message?.map((msg) => (
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle2 className="text-green-600 w-6 h-6" />
                ) : (
                  <AlertCircle className="text-red-600 w-6 h-6" />
                )}
                <p
                  className={`font-medium ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {msg}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
