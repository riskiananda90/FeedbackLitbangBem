import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle, Share2, Link2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  articleUrl: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  articleTitle,
  articleUrl
}) => {
  const handleWhatsAppShare = () => {
    const message = `🔥 Artikel Menarik!\n\n"${articleTitle}"\n\n📖 Baca selengkapnya: ${articleUrl}\n\n#BEMLitbang #InformasiTerkini`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Membuka WhatsApp...', {
      description: 'Artikel siap dibagikan!',
      duration: 3000,
    });
    onClose();
  };

  const handleTelegramShare = () => {
    const message = `📚 ${articleTitle}\n\n${articleUrl}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    toast.success('Membuka Telegram...', {
      description: 'Artikel siap dibagikan!',
      duration: 3000,
    });
    onClose();
  };

  const handleTwitterShare = () => {
    const message = `📖 Baca artikel menarik: "${articleTitle}" ${articleUrl} #BEMLitbang`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
    toast.success('Membuka Twitter...', {
      description: 'Artikel siap dibagikan!',
      duration: 3000,
    });
    onClose();
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(articleUrl);
    toast.success('📱 Link berhasil disalin!', {
      description: 'Sekarang paste di Instagram Story atau DM Anda',
      duration: 4000,
    });
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    toast.success('🔗 Link berhasil disalin!', {
      description: 'Link sudah tersimpan di clipboard',
      duration: 3000,
    });
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: `Baca artikel menarik: "${articleTitle}"`,
          url: articleUrl,
        });
        toast.success('Artikel berhasil dibagikan!');
        onClose();
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          toast.error('Gagal membagikan artikel');
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-xs sm:max-w-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="relative pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800 pr-8">
            Bagikan Artikel
          </DialogTitle>
          <p className="text-sm text-gray-900 mt-2 line-clamp-2">
            "{articleTitle}"
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Primary Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsAppShare}
              className="bg-green-500/80 backdrop-blur-sm hover:bg-green-600/90 text-white flex items-center gap-3 justify-center px-4 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-green-400/30"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </Button>

            <Button
              onClick={handleTelegramShare}
              className="bg-blue-500/80 backdrop-blur-sm hover:bg-blue-600/90 text-white flex items-center gap-3 justify-center px-4 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-400/30"
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Telegram</span>
            </Button>
          </div>

          {/* Secondary Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleTwitterShare}
              className="bg-sky-400/80 backdrop-blur-sm hover:bg-sky-500/90 text-white flex items-center gap-3 justify-center px-4 py-3 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-sky-300/30"
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <span className="text-sky-500 text-xs font-bold">𝕏</span>
              </div>
              <span className="font-medium">Twitter</span>
            </Button>

            <Button
              onClick={handleInstagramShare}
              className="bg-pink-500/80 backdrop-blur-sm hover:bg-pink-600/90 text-white flex items-center gap-3 justify-center px-4 py-3 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-pink-400/30"
            >
              <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center">
                <span className="text-pink-500 text-xs font-bold">IG</span>
              </div>
              <span className="font-medium">Instagram</span>
            </Button>
          </div>

          {/* Utility Options */}
          <div className="space-y-2 pt-2 border-t border-white/20">
            {navigator.share && (
              <Button
                onClick={handleNativeShare}
                className="w-full bg-purple-500/80 backdrop-blur-sm hover:bg-purple-600/90 text-white flex items-center gap-3 justify-center px-4 py-3 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-purple-400/30"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Bagikan Lainnya</span>
              </Button>
            )}

            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 hover:border-white/40 text-gray-900 flex items-center gap-3 justify-center px-4 py-3 h-auto rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <Copy className="w-5 h-5" />
              <span className="font-medium">Salin Tautan</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/20 text-center">
          <p className="text-xs text-gray-900 flex items-center justify-center gap-1">
            <Link2 className="w-4 h-4" />
            Bagikan pengetahuan, wujudkan perubahan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
