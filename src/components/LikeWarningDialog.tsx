
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-lg font-semibold">
            Peringatan
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Tolong isi nama dan feedback Anda terlebih dahulu sebelum memberikan like pada feedback orang lain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-4">
          <Button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            Mengerti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
