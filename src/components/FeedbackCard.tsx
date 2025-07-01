
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

  const getAvatarGradient = (name: string) => {
    const colors = [
      'from-pink-400 to-purple-600',
      'from-blue-400 to-indigo-600',
      'from-green-400 to-emerald-600',
      'from-yellow-400 to-orange-600',
      'from-red-400 to-pink-600',
      'from-indigo-400 to-purple-600',
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
        className="backdrop-blur-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fade-in bg-white/50 border-gray-200 hover:bg-white/70"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border border-white shadow-lg flex-shrink-0">
              <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(feedback.name)} text-white font-bold text-xs sm:text-sm`}>
                {getInitials(feedback.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate text-gray-800">
                    {feedback.name}
                  </h3>
                  <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    {getCategoryIcon(feedback.category)}
                    <span className="capitalize hidden sm:inline">{feedback.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getSentimentColor(feedback.sentiment)}`}></div>
                  <Button variant="ghost" size="sm" className="p-0.5 sm:p-1 h-auto">
                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>
                  {formatDistanceToNow(feedback.timestamp, { 
                    addSuffix: true, 
                    locale: id 
                  })}
                </span>
              </div>

              <p className="mb-2 sm:mb-3 lg:mb-4 leading-relaxed text-sm sm:text-base text-gray-700">
                {displayText}
              </p>

              {shouldTruncate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm text-blue-500 hover:text-blue-600 hover:bg-gray-100"
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
                      className={`flex items-center gap-1 sm:gap-2 transition-all duration-200 hover:scale-105 p-1 sm:p-2 h-auto text-xs sm:text-sm ${
                        hasLiked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                      } ${isLiking ? 'animate-bounce' : ''}`}
                    >
                      <div className="relative">
                        <Heart 
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
                            hasLiked ? 'fill-current scale-110' : ''
                          } ${isLiking ? 'animate-pulse' : ''}`} 
                        />
                        
                        <div 
                          id={`hearts-${feedback.id}`}
                          className="absolute inset-0 pointer-events-none"
                        ></div>
                      </div>
                      
                      <span className={`font-medium transition-all duration-200 text-xs sm:text-sm ${
                        isLiking ? 'animate-pulse' : ''
                      }`}>
                        {localLikes}
                      </span>
                    </Button>

                    {localLikes > 0 && localLikes % 10 === 0 && (
                      <div className="absolute -top-1 -right-1 text-xs">
                        🎉
                      </div>
                    )}
                  </div>
                </div>

                {feedback.likes > 20 && (
                  <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-medium">
                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Trending</span>
                    <span className="sm:hidden">🔥</span>
                  </div>
                )}
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
