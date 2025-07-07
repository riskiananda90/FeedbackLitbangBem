import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, TrendingUp, Users, Award, Clock } from 'lucide-react';

interface StatsDashboardProps {
  feedbacks: Array<{
    id: string; // Changed from number to string
    name: string;
    feedback: string;
    likes: number;
    timestamp: Date;
  }>;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  feedbacks
}) => {
  const stats = useMemo(() => {
    const totalFeedbacks = feedbacks.length;
    const totalLikes = feedbacks.reduce((sum, fb) => sum + fb.likes, 0);
    const averageLikes = totalFeedbacks > 0 ? (totalLikes / totalFeedbacks).toFixed(1) : 0;
    
    // Most active user
    const userActivity = feedbacks.reduce((acc, fb) => {
      acc[fb.name] = (acc[fb.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostActiveUser = Object.entries(userActivity).sort(([,a], [,b]) => b - a)[0];
    
    // Recent activity (last 24 hours)
    const recentActivity = feedbacks.filter(
      fb => Date.now() - fb.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;
    
    // Top feedback
    const topFeedback = feedbacks.sort((a, b) => b.likes - a.likes)[0];
    
    // Engagement rate (likes per feedback)
    const engagementRate = totalFeedbacks > 0 ? ((totalLikes / totalFeedbacks) * 100).toFixed(1) : 0;
    
    return {
      totalFeedbacks,
      totalLikes,
      averageLikes,
      mostActiveUser: mostActiveUser ? mostActiveUser[0] : 'Belum ada',
      mostActiveCount: mostActiveUser ? mostActiveUser[1] : 0,
      recentActivity,
      topFeedback,
      engagementRate
    };
  }, [feedbacks]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <Card className="backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 border-gray-200">
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {title}
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 animate-count-up">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Project Leader Section */}
      <Card className="backdrop-blur-lg bg-white/50 border-gray-200 transition-all duration-300">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face" 
                alt="Penanggung Jawab Litbang"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">
                Dr. Maya Sari Dewi, M.Si
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Penanggung Jawab Litbang BEM
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                Penelitian & Pengembangan Organisasi
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - 3 columns on mobile, more on larger screens */}
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4">
        <StatCard
          title="Total Feedback"
          value={stats.totalFeedbacks}
          icon={MessageSquare}
          color="from-blue-500 to-blue-600"
        />
        
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          icon={Heart}
          color="from-red-500 to-pink-600"
        />
        
        <StatCard
          title="Rata-rata Likes"
          value={stats.averageLikes}
          icon={TrendingUp}
          color="from-green-500 to-emerald-600"
          subtitle="per feedback"
        />
        
        <StatCard
          title="Kontributor Aktif"
          value={stats.mostActiveUser.split(' ')[0]}
          icon={Users}
          color="from-purple-500 to-indigo-600"
          subtitle={`${stats.mostActiveCount} feedback`}
        />
        
        <StatCard
          title="Aktivitas 24 Jam"
          value={stats.recentActivity}
          icon={Clock}
          color="from-orange-500 to-red-600"
          subtitle="feedback baru"
        />
        
        <StatCard
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          icon={Award}
          color="from-yellow-500 to-orange-600"
          subtitle="likes/feedback"
        />
      </div>
    </div>
  );
};
