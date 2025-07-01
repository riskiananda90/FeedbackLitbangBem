import React, { useState, useCallback, useMemo } from 'react';
import { FeedbackForm } from '@/components/FeedbackForm';
import { FeedbackCard } from '@/components/FeedbackCard';
import { StatsDashboard } from '@/components/StatsDashboard';
import { FilterControls } from '@/components/FilterControls';
import { Header } from '@/components/Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Sample data with Indonesian context
const initialFeedbacks = [
  {
    id: 1,
    name: "Dr. Sarah Andini",
    feedback: "Metodologi penelitian yang digunakan sudah sangat baik, namun perlu ditambahkan analisis statistik yang lebih mendalam untuk memperkuat validitas data. Saran saya adalah menggunakan multiple regression analysis untuk hasil yang lebih komprehensif.",
    likes: 24,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    category: "metodologi",
    sentiment: "constructive",
    likedBy: []
  },
  {
    id: 2,
    name: "Ahmad Rizky Pratama",
    feedback: "Artikel ini memberikan insight baru tentang inovasi teknologi di kampus. Sangat aplikatif dan bisa diimplementasikan langsung. Terima kasih untuk tim litbang BEM!",
    likes: 18,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    category: "appreciation",
    sentiment: "positive",
    likedBy: []
  },
  {
    id: 3,
    name: "Fitri Maharani",
    feedback: "Bagian literature review perlu diperkuat dengan referensi terbaru. Beberapa sumber yang digunakan sudah outdated. Mungkin bisa ditambahkan jurnal internasional dari 2023-2024.",
    likes: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    category: "literature",
    sentiment: "constructive",
    likedBy: []
  },
  {
    id: 4,
    name: "Budi Santoso",
    feedback: "Implementasi hasil penelitian ini sangat menarik! Saya tertarik untuk berkolaborasi dalam pengembangan lebih lanjut. Bisa dibuatkan roadmap implementasinya?",
    likes: 32,
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    category: "collaboration",
    sentiment: "positive",
    likedBy: []
  },
  {
    id: 5,
    name: "Maya Sari Dewi",
    feedback: "Grafik dan visualisasi data kurang informatif. Mungkin bisa menggunakan chart yang lebih interaktif atau infografis yang lebih menarik untuk memudahkan pembaca memahami hasil penelitian.",
    likes: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    category: "visualization",
    sentiment: "constructive",
    likedBy: []
  },
  {
    id: 6,
    name: "Rian Firmansyah",
    feedback: "Luar biasa sekali! Penelitian ini memberikan solusi konkret untuk masalah yang selama ini dihadapi mahasiswa. Semoga bisa segera diimplementasikan di seluruh fakultas.",
    likes: 28,
    timestamp: new Date(Date.now() - 1000 * 60 * 360),
    category: "appreciation",
    sentiment: "positive",
    likedBy: []
  }
];

const Index = () => {
  const [feedbacks, setFeedbacks] = useLocalStorage('feedbacks', initialFeedbacks);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', '');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort feedbacks
  const filteredFeedbacks = useMemo(() => {
    let filtered = feedbacks.filter(feedback => {
      const matchesSearch = feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase());
      
      switch (filterType) {
        case 'top5':
          return matchesSearch && feedbacks.indexOf(feedback) < 5;
        case 'popular':
          return matchesSearch && feedback.likes > 15;
        case 'recent':
          return matchesSearch && (Date.now() - feedback.timestamp.getTime()) < 24 * 60 * 60 * 1000;
        case 'trending':
          return matchesSearch && feedback.likes > 20;
        default:
          return matchesSearch;
      }
    });

    // Sort by likes descending for most filters
    if (filterType === 'popular' || filterType === 'trending') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (filterType === 'recent') {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return filtered;
  }, [feedbacks, filterType, searchQuery]);

  // Handle new feedback submission
  const handleNewFeedback = useCallback((newFeedback) => {
    const feedbackWithId = {
      ...newFeedback,
      id: Date.now(),
      likes: 0,
      timestamp: new Date(),
      category: 'general',
      sentiment: 'neutral',
      likedBy: []
    };
    
    setFeedbacks(prev => [feedbackWithId, ...prev]);
    setCurrentUser(newFeedback.name);
    
    toast.success("Feedback berhasil dikirim! 🎉", {
      description: "Terima kasih atas kontribusi Anda untuk litbang BEM",
      duration: 5000,
    });
  }, [setFeedbacks, setCurrentUser]);

  // Handle like with animations
  const handleLike = useCallback((feedbackId, userName) => {
    setFeedbacks(prev => prev.map(feedback => {
      if (feedback.id === feedbackId) {
        const alreadyLiked = feedback.likedBy?.includes(userName);
        
        if (alreadyLiked) {
          toast.error("Anda sudah menyukai feedback ini! ❤️");
          return feedback;
        }

        const newLikes = feedback.likes + 1;
        const updatedFeedback = {
          ...feedback,
          likes: newLikes,
          likedBy: [...(feedback.likedBy || []), userName]
        };

        // Milestone notifications
        if (newLikes === 10 || newLikes === 25 || newLikes === 50) {
          toast.success(`🎉 Milestone ${newLikes} likes tercapai!`, {
            description: "Feedback ini semakin populer!",
            duration: 4000,
          });
        }

        return updatedFeedback;
      }
      return feedback;
    }));
  }, [setFeedbacks]);

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Stats Dashboard */}
        <StatsDashboard feedbacks={feedbacks} />

        {/* Main Content Grid - Mobile First Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8 mt-4 lg:mt-8">
          {/* Mobile: Form and Filters Stack Vertically */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            <FeedbackForm 
              onSubmit={handleNewFeedback}
              currentUser={currentUser}
            />
            
            <FilterControls
              filterType={filterType}
              onFilterChange={setFilterType}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              feedbacks={feedbacks}
            />
          </div>

          {/* Mobile: Feedback List Takes Full Width */}
          <div className="lg:col-span-3">
            <div className="mb-4 lg:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
                <span className="text-sm sm:text-base lg:text-xl">
                  Feedback Terbaru ({filteredFeedbacks.length})
                </span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {filteredFeedbacks.map((feedback, index) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onLike={handleLike}
                  currentUser={currentUser}
                  animationDelay={index * 100}
                />
              ))}
            </div>

            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-8 lg:py-12 text-gray-500">
                <div className="text-4xl lg:text-6xl mb-2 lg:mb-4">🔍</div>
                <p className="text-base lg:text-xl mb-1 lg:mb-2">No feedback found</p>
                <p className="text-sm lg:text-base">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
