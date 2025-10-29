import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function Header({ onLoginClick, onLogout, isAuthenticated, isLoading }: HeaderProps) {

  if (isLoading) {
    return (
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Prediction Market</h1>
          <div className="w-20 h-8 bg-slate-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Prediction Market</h1>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>Logged in</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-medium cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Click to Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;