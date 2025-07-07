import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Halaman mungkin telah dipindahkan atau tidak tersedia.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full py-3 rounded-lg font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Halaman Sebelumnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;