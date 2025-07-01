import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center animate-fade-in">
          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-4">
              Maaf, halaman yang Anda cari tidak dapat ditemukan.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Path:</span> {location.pathname}
              </p>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Atau coba navigasi ini:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <a 
                href="/"
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                Dashboard
              </a>
              <a 
                href="/feedback"
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                Feedback
              </a>
              <a 
                href="/about"
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                Tentang
              </a>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-xs text-gray-400">
            <p>© 2025 Sistem Feedback BEM - Litbang Division</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotFound;