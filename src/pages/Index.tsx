import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FeedbackForm } from '@/components/FeedbackForm';
import { FeedbackCard } from '@/components/FeedbackCard';
import { StatsDashboard } from '@/components/StatsDashboard';
import { FilterControls } from '@/components/FilterControls';
import { Header } from '@/components/Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  name: string;
  feedback: string;
  likes: number;
  timestamp: Date;
  category: string;
  sentiment: string;
  likedBy: string[];
}

const Index = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', '');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch feedbacks from database
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching feedbacks:', error);
          return;
        }

        const formattedFeedbacks: Feedback[] = data.map(fb => ({
          id: fb.id,
          name: fb.name,
          feedback: fb.feedback,
          likes: fb.likes,
          timestamp: new Date(fb.created_at),
          category: fb.category || 'general',
          sentiment: fb.sentiment || 'neutral',
          likedBy: fb.liked_by || []
        }));

        setFeedbacks(formattedFeedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);
  
  // Check if user has submitted feedback
  const hasUserSubmittedFeedback = useMemo(() => {
    return currentUser.trim() !== '' && feedbacks.some(feedback => feedback.name === currentUser);
  }, [currentUser, feedbacks]);

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
  const handleNewFeedback = useCallback(async (newFeedback) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          name: newFeedback.name,
          feedback: newFeedback.feedback,
          likes: 0,
          category: 'general',
          sentiment: 'neutral',
          liked_by: []
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting feedback:', error);
        toast.error("Gagal mengirim feedback. Silakan coba lagi.");
        return;
      }

      const formattedFeedback: Feedback = {
        id: data.id,
        name: data.name,
        feedback: data.feedback,
        likes: data.likes,
        timestamp: new Date(data.created_at),
        category: data.category || 'general',
        sentiment: data.sentiment || 'neutral',
        likedBy: data.liked_by || []
      };

      setFeedbacks(prev => [formattedFeedback, ...prev]);
      setCurrentUser(newFeedback.name);
      
      toast.success("Feedback berhasil dikirim! 🎉", {
        description: "Terima kasih atas kontribusi Anda untuk litbang BEM",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Gagal mengirim feedback. Silakan coba lagi.");
    }
  }, [setCurrentUser]);

  // Handle like with animations
  const handleLike = useCallback(async (feedbackId: string, userName: string) => {
    try {
      // Check if already liked
      const currentFeedback = feedbacks.find(f => f.id === feedbackId);
      if (currentFeedback?.likedBy?.includes(userName)) {
        toast.error("Anda sudah menyukai feedback ini! ❤️");
        return;
      }

      const newLikes = (currentFeedback?.likes || 0) + 1;
      const newLikedBy = [...(currentFeedback?.likedBy || []), userName];

      const { error } = await supabase
        .from('feedback')
        .update({
          likes: newLikes,
          liked_by: newLikedBy
        })
        .eq('id', feedbackId);

      if (error) {
        console.error('Error updating likes:', error);
        toast.error("Gagal memberikan like. Silakan coba lagi.");
        return;
      }

      setFeedbacks(prev => prev.map(feedback => {
        if (feedback.id === feedbackId) {
          const updatedFeedback = {
            ...feedback,
            likes: newLikes,
            likedBy: newLikedBy
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
    } catch (error) {
      console.error('Error liking feedback:', error);
      toast.error("Gagal memberikan like. Silakan coba lagi.");
    }
  }, [feedbacks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat feedback...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
                  hasUserSubmittedFeedback={hasUserSubmittedFeedback}
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
