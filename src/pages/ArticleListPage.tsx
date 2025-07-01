
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { getAllArticles } from '@/data/articles';
import { Calendar, Clock, Eye, MessageSquare, Tag, User, ArrowRight } from 'lucide-react';

const ArticleListPage = () => {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
            Artikel Litbang BEM
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Penelitian dan pengembangan untuk kemajuan organisasi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-gray-200">
              <CardContent className="p-0">
                {/* Article Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/80 text-gray-700">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 text-gray-900">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base mb-4 line-clamp-3 text-gray-700">
                    {article.description}
                  </p>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span className="truncate">{article.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.publishDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Eye className="w-3 h-3" />
                      <span>{article.viewCount}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{article.totalFeedbacks} feedback</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/feedback/${article.slug}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <span>Berikan Feedback</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleListPage;
