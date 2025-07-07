
import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b bg-white border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-4 max-w-8xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Feedback Litbang BEM
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Sistem Feedback Artikel Penelitian & Pengembangan
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
