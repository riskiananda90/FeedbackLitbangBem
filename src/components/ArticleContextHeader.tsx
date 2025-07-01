
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Eye, MessageSquare, Share2, Tag, User } from 'lucide-react';
import { Article } from '@/types/article';
import { Link, useNavigate } from 'react-router-dom';
import { ShareDialog } from './ShareDialog';

interface ArticleContextHeaderProps {
  article: Article;
}

export const ArticleContextHeader: React.FC<ArticleContextHeaderProps> = ({
  article
}) => {
  const navigate = useNavigate();
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleBackToArticle = () => {
    navigate(-1);
  };

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/" className="hover:text-blue-500 transition-colors">
            BEM Website
          </Link>
          <span>›</span>
          <span>Artikel</span>
          <span>›</span>
          <span className="truncate max-w-32 sm:max-w-none">{article.title}</span>
          <span>›</span>
          <span className="text-blue-500">Feedback</span>
        </div>
      </nav>

      {/* Article Context Card */}
      <Card className="backdrop-blur-lg bg-white/50 border-gray-200 transition-all duration-300">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
            {/* Article Image */}
            <div className="w-full lg:w-48 xl:w-64 flex-shrink-0">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-32 sm:h-40 lg:h-32 xl:h-40 object-cover rounded-lg"
              />
            </div>

            {/* Article Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight text-gray-900">
                  {article.title}
                </h1>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex-shrink-0 p-1.5 sm:p-2 h-auto hover:bg-gray-100"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              <p className="text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed text-gray-700">
                {article.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <User className="w-3 h-3" />
                  <span className="truncate">{article.author}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(article.publishDate).toLocaleDateString('id-ID')}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime} min baca</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Eye className="w-3 h-3" />
                  <span>{article.viewCount} views</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  onClick={handleBackToArticle}
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Baca Artikel Lengkap
                </Button>
                
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{article.totalFeedbacks} feedback</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        articleTitle={article.title}
        articleUrl={window.location.href}
      />
    </div>
  );
};
