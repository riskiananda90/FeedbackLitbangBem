import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface LikeWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LikeWarningDialog: React.FC<LikeWarningDialogProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] sm:max-w-md bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-red-50/50 animate-pulse" />

        <DialogHeader className="text-center relative z-10 pt-6">
          <div className="mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-200/50 shadow-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-600 animate-bounce" />
            </div>
          </div>

          <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
            ⚠️ Peringatan
          </DialogTitle>

          <DialogDescription className="text-gray-600 leading-relaxed px-2">
            <span className="block mb-2">
              Mohon lengkapi <span className="font-semibold text-gray-800">nama</span> dan{' '}
              <span className="font-semibold text-gray-800">feedback</span> Anda terlebih dahulu
            </span>
            <span className="text-sm text-gray-500">
              sebelum memberikan like pada feedback orang lain
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-6 mb-4 relative z-10">
          <Button
            onClick={onClose}
            className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-0"
          >
            <span className="relative z-10">Mengerti ✓</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
