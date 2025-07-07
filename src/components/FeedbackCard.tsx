
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MoreHorizontal, Clock, ThumbsUp, Star, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { LikeWarningDialog } from './LikeWarningDialog';

interface FeedbackCardProps {
  feedback: {
    id: number;
    name: string;
    feedback: string;
    likes: number;
    timestamp: Date;
    category: string;
    sentiment: string;
    likedBy?: string[];
  };
  onLike: (id: number, userName: string) => void;
  currentUser: string;
  animationDelay: number;
  hasUserSubmittedFeedback: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onLike,
  currentUser,
  animationDelay,
  hasUserSubmittedFeedback
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState(feedback.likes);
  const [hasLiked, setHasLiked] = useState(
    feedback.likedBy?.includes(currentUser) || false
  );
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const shouldTruncate = feedback.feedback.length > 120;
  const displayText = shouldTruncate && !isExpanded 
    ? feedback.feedback.substring(0, 120) + '...' 
    : feedback.feedback;

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-slate-700',
      'bg-gray-700', 
      'bg-zinc-700',
      'bg-neutral-700',
      'bg-stone-700',
      'bg-blue-700',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLike = async () => {
    // Check if user has filled name and submitted feedback
    if (!currentUser.trim() || !hasUserSubmittedFeedback) {
      setShowWarningDialog(true);
      return;
    }

    if (hasLiked) {
      return;
    }

    setIsLiking(true);
    setLocalLikes(prev => prev + 1);
    setHasLiked(true);

    createFloatingHearts();

    setTimeout(() => {
      onLike(feedback.id, currentUser);
      setIsLiking(false);
    }, 300);
  };

  const createFloatingHearts = () => {
    const heartsContainer = document.getElementById(`hearts-${feedback.id}`);
    if (!heartsContainer) return;

    for (let i = 0; i < 5; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.className = 'absolute text-sm animate-float-up pointer-events-none';
      heart.style.left = `${Math.random() * 40 - 20}px`;
      heart.style.animationDelay = `${i * 100}ms`;
      heartsContainer.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 2000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metodologi': return <ThumbsUp className="w-3 h-3" />;
      case 'appreciation': return <Star className="w-3 h-3" />;
      case 'technical': return <ThumbsUp className="w-3 h-3" />;
      case 'general': return <ThumbsUp className="w-3 h-3" />;
      default: return <ThumbsUp className="w-3 h-3" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'constructive': return 'text-yellow-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <>
      <Card 
        className="bg-white border border-gray-100 rounded-lg overflow-hidden"
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
            <div className="relative">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 border border-gray-200 flex-shrink-0">
                <AvatarFallback className={`${getAvatarColor(feedback.name)} text-white font-medium text-sm sm:text-base`}>
                  {getInitials(feedback.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <h3 className="font-medium text-base sm:text-lg truncate text-gray-900">
                    {feedback.name}
                  </h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    feedback.category === 'appreciation' ? 'bg-green-50 text-green-700' :
                    feedback.category === 'metodologi' ? 'bg-blue-50 text-blue-700' :
                    feedback.category === 'technical' ? 'bg-purple-50 text-purple-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {getCategoryIcon(feedback.category)}
                    <span className="capitalize hidden sm:inline">{feedback.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4 text-sm text-gray-500">
                <Clock className="w-4 h-4 text-gray-800" />
                <span className="font-medium">
                  {formatDistanceToNow(new Date(feedback.timestamp), { 
                    addSuffix: true, 
                    locale: id 
                  })}
                </span>
                {/* Recent indicator */}
                {(Date.now() - new Date(feedback.timestamp).getTime()) < 24 * 60 * 60 * 1000 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Baru
                  </span>
                )}
              </div>

              <div className="relative">
                <p className="mb-3 sm:mb-4 lg:mb-5 leading-relaxed text-sm sm:text-base text-gray-700">
                  {displayText}
                </p>
              </div>

              {shouldTruncate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto mb-3 sm:mb-4 lg:mb-5 text-sm font-semibold text-gray-700 hover:text-gray-800 bg-gray-200 rounded-lg px-2 py-1 transition-all duration-200"
                >
                  {isExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
                </Button>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={isLiking || hasLiked}
                      className={`flex items-center gap-2 p-2 text-sm rounded ${
                        hasLiked 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} 
                      />
                      <span className="font-medium">
                        {localLikes}
                      </span>
                    </Button>

                    {localLikes > 0 && localLikes % 10 === 0 && (
                      <div className="absolute -top-2 -right-2 text-lg animate-bounce">
                        🎉
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {feedback.likes > 20 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-medium">
                      <Flame className="w-3 h-3" />
                      <span className="hidden sm:inline">Trending</span>
                      <span className="sm:hidden">🔥</span>
                    </div>
                  )}
                  
                  {feedback.sentiment === 'positive' && feedback.likes > 15 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                      <Star className="w-3 h-3" />
                      <span className="hidden sm:inline">Top</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <LikeWarningDialog
        isOpen={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
      />
    </>
  );
};
