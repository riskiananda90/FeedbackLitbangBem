
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { getAllArticles } from '@/data/articles';
import { Article } from '@/types/article';
import { Calendar, Clock, Eye, MessageSquare, Tag, User, ArrowRight, Search, Filter, TrendingUp, Sparkles } from 'lucide-react';

const ArticleListPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = ['all', ...new Set(articles.map(article => article.category))];
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat artikel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Artikel Litbang BEM
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Jelajahi penelitian dan pengembangan terdepan untuk kemajuan organisasi mahasiswa
          </p>
          
          {/* Search and Filter Bar */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:border-gray-400 outline-none text-lg"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-8 py-4 rounded-lg border border-gray-200 focus:border-gray-400 outline-none bg-white appearance-none cursor-pointer text-lg"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Semua Kategori' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 flex justify-center space-x-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{articles.length}</div>
              <div className="text-gray-600">Total Artikel</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{articles.reduce((sum, article) => sum + article.totalFeedbacks, 0)}</div>
              <div className="text-gray-600">Total Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{articles.reduce((sum, article) => sum + article.viewCount, 0)}</div>
              <div className="text-gray-600">Total Views</div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {filteredArticles.map((article, index) => (
            <Card 
              key={article.id} 
              className="group transition-all duration-300 hover:-translate-y-1 bg-white rounded-lg overflow-hidden border border-gray-100"
            >
              <CardContent className="p-0">

                {/* Article Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-gray-900 leading-tight">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.publishDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{article.totalFeedbacks} feedback</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link to={`/feedback/${article.slug}`}>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors duration-200">
                      <span>Berikan Feedback</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Artikel tidak ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleListPage;
