
import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-lg bg-white/80 border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">

            <div>
              <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-blue-600">
                <span className="hidden sm:inline">Feedback Artikel Litbang</span>
                <span className="sm:hidden">Artikel Litbang</span>
              </h1>
              <p className="text-xs sm:text-sm hidden sm:block text-gray-600">
                Sistem Feedback Artikel Penelitian & Pengembangan
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
