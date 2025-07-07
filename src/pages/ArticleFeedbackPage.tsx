import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ContextualFeedbackForm } from "@/components/ContextualFeedbackForm";
import { FeedbackCard } from "@/components/FeedbackCard";
import { FilterControls } from "@/components/FilterControls";
import { Header } from "@/components/Header";
import { ArticleContextHeader } from "@/components/ArticleContextHeader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getArticleBySlug } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";
import { Article, ArticleContextualFeedback } from "@/types/article";
import { toast } from "sonner";

// Sample contextual feedback data
const getInitialFeedbacks = (
  articleSlug: string
): ArticleContextualFeedback[] => {
  const baseFeedbacks = {
    "artikel-ai-sistem-akademik": [
      {
        id: 1,
        name: "Dr. Sarah Andini",
        feedback:
          "Implementasi AI dalam sistem akademik memang menjanjikan, tapi concern utama saya adalah pada aspek privacy dan data security. Bagaimana tim litbang akan memastikan data mahasiswa terlindungi?",
        likes: 24,
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        category: "security",
        sentiment: "constructive",
        likedBy: [],
        articleId: articleSlug,
        relevanceScore: 95,
        tags: ["privacy", "security", "data"],
      },
      {
        id: 2,
        name: "Ahmad Rizky Pratama",
        feedback:
          "Konsep AI untuk prediksi performa akademik mahasiswa sangat inovatif! Tapi apakah sistem ini bisa handle variasi gaya belajar yang berbeda-beda?",
        likes: 18,
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        category: "technical",
        sentiment: "positive",
        likedBy: [],
        articleId: articleSlug,
        relevanceScore: 88,
        tags: ["AI", "prediction", "learning"],
      },
    ],
    "mobile-app-kemahasiswaan": [
      {
        id: 3,
        name: "Fitri Maharani",
        feedback:
          "UI/UX mockup yang ditampilkan sudah bagus, tapi saya rasa perlu ada fitur offline mode untuk akses informasi basic ketika jaringan tidak stabil.",
        likes: 15,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        category: "ux",
        sentiment: "constructive",
        likedBy: [],
        articleId: articleSlug,
        relevanceScore: 92,
        tags: ["UX", "offline", "accessibility"],
      },
    ],
    "penelitian-blockchain-voting": [
      {
        id: 4,
        name: "Budi Santoso",
        feedback:
          "Blockchain untuk voting memang secure, tapi bagaimana dengan scalability? Apakah bisa handle 20,000+ mahasiswa voting bersamaan?",
        likes: 12,
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        category: "technical",
        sentiment: "constructive",
        likedBy: [],
        articleId: articleSlug,
        relevanceScore: 90,
        tags: ["blockchain", "scalability", "performance"],
      },
    ],
  };

  return baseFeedbacks[articleSlug] || [];
};

const ArticleFeedbackPage = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  
  // State hooks - pastikan urutan selalu sama
  const [article, setArticle] = useState<Article | null>(null);
  const [feedbacks, setFeedbacks] = useState<ArticleContextualFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", "");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUserSubmittedFeedback, setHasUserSubmittedFeedback] = useState(false);

  // Effect hooks
  useEffect(() => {
    const fetchData = async () => {
      if (!articleSlug) {
        setLoading(false);
        return;
      }

      try {
        // Fetch article
        const articleData = await getArticleBySlug(articleSlug);
        if (!articleData) {
          setLoading(false);
          return;
        }
        setArticle(articleData);

        // Fetch article feedbacks
        const { data: feedbackData, error } = await supabase
          .from("article_feedback")
          .select("*")
          .eq("article_id", articleData.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching article feedbacks:", error);
        } else {
          const formattedFeedbacks: ArticleContextualFeedback[] =
            feedbackData.map((fb) => ({
              id: fb.id,
              name: fb.name,
              feedback: fb.feedback,
              likes: fb.likes,
              timestamp: new Date(fb.created_at),
              category: fb.category || "general",
              sentiment: fb.sentiment || "neutral",
              likedBy: fb.liked_by || [],
              articleId: fb.article_id,
              relevanceScore: fb.relevance_score || 85,
              tags: fb.tags || [],
            }));
          setFeedbacks(formattedFeedbacks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleSlug]);

  useEffect(() => {
    if (currentUser && feedbacks.length > 0) {
      const userFeedback = feedbacks.find((f) => f.name === currentUser);
      setHasUserSubmittedFeedback(!!userFeedback);
    }
  }, [currentUser, feedbacks]);

  // Memoized values
  const filteredFeedbacks = useMemo(() => {
    let filtered = feedbacks.filter((feedback) => {
      const matchesSearch =
        feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase());

      switch (filterType) {
        case "top5":
          return matchesSearch && feedbacks.indexOf(feedback) < 5;
        case "popular":
          return matchesSearch && feedback.likes > 10;
        case "recent":
          return (
            matchesSearch &&
            Date.now() - feedback.timestamp.getTime() < 24 * 60 * 60 * 1000
          );
        case "trending":
          return matchesSearch && feedback.likes > 15;
        case "relevant":
          return matchesSearch && feedback.relevanceScore > 80;
        default:
          return matchesSearch;
      }
    });

    // Sort by relevance score and likes
    if (filterType === "relevant") {
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (filterType === "popular" || filterType === "trending") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (filterType === "recent") {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return filtered;
  }, [feedbacks, filterType, searchQuery]);

  // Callback hooks
  const handleNewFeedback = useCallback(
    async (newFeedback) => {
      if (!article) return;

      try {
        const { data, error } = await supabase
          .from("article_feedback")
          .insert({
            article_id: article.id,
            name: newFeedback.name,
            feedback: newFeedback.feedback,
            likes: 0,
            category: "general",
            sentiment: "neutral",
            relevance_score: 85,
            tags: [],
            liked_by: [],
          })
          .select()
          .single();

        if (error) {
          console.error("Error inserting article feedback:", error);
          toast.error("Gagal mengirim feedback. Silakan coba lagi.");
          return;
        }

        const formattedFeedback: ArticleContextualFeedback = {
          id: data.id,
          name: data.name,
          feedback: data.feedback,
          likes: data.likes,
          timestamp: new Date(data.created_at),
          category: data.category || "general",
          sentiment: data.sentiment || "neutral",
          likedBy: data.liked_by || [],
          articleId: data.article_id,
          relevanceScore: data.relevance_score || 85,
          tags: data.tags || [],
        };

        setFeedbacks((prev) => [formattedFeedback, ...prev]);
        setCurrentUser(newFeedback.name);
        setHasUserSubmittedFeedback(true);

        toast.success("Feedback berhasil dikirim! 🎉", {
          description: `Terima kasih atas feedback Anda untuk artikel "${article.title}"`,
          duration: 5000,
        });
      } catch (error) {
        console.error("Error submitting article feedback:", error);
        toast.error("Gagal mengirim feedback. Silakan coba lagi.");
      }
    },
    [article, setCurrentUser]
  );

  const handleLike = useCallback(
    async (feedbackId: string, userName: string) => {
      try {
        // Check if already liked
        const currentFeedback = feedbacks.find((f) => f.id === feedbackId);
        if (currentFeedback?.likedBy?.includes(userName)) {
          toast.error("Anda sudah menyukai feedback ini! ❤️");
          return;
        }

        const newLikes = (currentFeedback?.likes || 0) + 1;
        const newLikedBy = [...(currentFeedback?.likedBy || []), userName];

        const { error } = await supabase
          .from("article_feedback")
          .update({
            likes: newLikes,
            liked_by: newLikedBy,
          })
          .eq("id", feedbackId);

        if (error) {
          console.error("Error updating article feedback likes:", error);
          toast.error("Gagal memberikan like. Silakan coba lagi.");
          return;
        }

        setFeedbacks((prev) =>
          prev.map((feedback) => {
            if (feedback.id === feedbackId) {
              const updatedFeedback = {
                ...feedback,
                likes: newLikes,
                likedBy: newLikedBy,
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
          })
        );
      } catch (error) {
        console.error("Error liking article feedback:", error);
        toast.error("Gagal memberikan like. Silakan coba lagi.");
      }
    },
    [feedbacks]
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
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

  // If article not found, redirect to 404
  if (!article) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Article Context Header */}
        <ArticleContextHeader article={article} />

        {/* Main Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8 mt-4 lg:mt-8">
          {/* Form */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            <ContextualFeedbackForm
              onSubmit={handleNewFeedback}
              currentUser={currentUser}
              article={article}
            />
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-3">
            {/* Filter Controls */}
            <div className="mb-4 lg:mb-6">
              <FilterControls
                filterType={filterType}
                onFilterChange={setFilterType}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                feedbacks={feedbacks}
              />
            </div>

            <div className="mb-4 lg:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                <span className="text-sm sm:text-base lg:text-xl">
                  Feedback untuk Artikel ({filteredFeedbacks.length})
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
                <p className="text-base lg:text-xl mb-1 lg:mb-2">
                  Belum ada feedback
                </p>
                <p className="text-sm lg:text-base">
                  Jadilah yang pertama memberikan feedback untuk artikel ini!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleFeedbackPage;