
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle, Share, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
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
    const message = `Baca artikel menarik ini: "${articleTitle}" - ${articleUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(facebookUrl, '_blank');
    onClose();
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(twitterUrl, '_blank');
    onClose();
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    window.open(linkedinUrl, '_blank');
    onClose();
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Artikel Menarik: ${articleTitle}`);
    const body = encodeURIComponent(`Halo, saya ingin berbagi artikel menarik ini dengan Anda:\n\n${articleTitle}\n\n${articleUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    onClose();
  };

  const handleTelegramShare = () => {
    const message = `Baca artikel menarik ini: "${articleTitle}" - ${articleUrl}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    onClose();
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(articleUrl);
    toast.success('Link berhasil disalin! Paste di Instagram Story atau DM Anda.');
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    toast.success('Link berhasil disalin ke clipboard!');
    onClose();
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      handler: handleWhatsAppShare,
      color: 'text-gray-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      handler: handleFacebookShare,
      color: 'text-gray-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      handler: handleTwitterShare,
      color: 'text-gray-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      handler: handleLinkedInShare,
      color: 'text-gray-700'
    },
    {
      name: 'Email',
      icon: Mail,
      handler: handleEmailShare,
      color: 'text-gray-700'
    },
    {
      name: 'Telegram',
      icon: Share,
      handler: handleTelegramShare,
      color: 'text-gray-700'
    },
    {
      name: 'Instagram',
      icon: () => (
        <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
          <span className="text-gray-700 text-xs font-medium">IG</span>
        </div>
      ),
      handler: handleInstagramShare,
      color: 'text-gray-700'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-sm sm:max-w-md bg-white p-4 sm:p-6">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-base sm:text-lg font-medium text-gray-900">
            Bagikan Artikel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1.5 sm:space-y-2">
          {shareOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Button
                key={index}
                onClick={option.handler}
                variant="outline"
                className="w-full flex items-center gap-2 sm:gap-3 justify-start px-3 sm:px-4 py-2 sm:py-3 h-auto border-gray-200 hover:bg-gray-50 text-gray-700 text-sm"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Bagikan ke {option.name}</span>
              </Button>
            );
          })}
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full flex items-center gap-2 sm:gap-3 justify-start px-3 sm:px-4 py-2 sm:py-3 h-auto border-gray-200 hover:bg-gray-50 text-gray-700 border-t-2 mt-3 sm:mt-4 pt-3 sm:pt-4 text-sm"
          >
            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Salin Tautan</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
