import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Users, 
  Edit3, 
  Trash2, 
  Plus,
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getAllArticles } from '@/data/articles';
import { Article } from '@/types/article';
import { toast } from 'sonner';

interface AdminSettings {
  maxFeedbackLength: number;
  moderationEnabled: boolean;
  autoApproval: boolean;
  emailNotifications: boolean;
}

interface Feedback {
  id: string;
  articleSlug: string;
  articleTitle: string;
  name: string;
  feedback: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
}

const AdminDashboard = () => {
  const [adminAuth, setAdminAuth] = useLocalStorage('adminAuth', null);
  const [articles, setArticles] = useLocalStorage('admin-articles', getAllArticles());
  const [feedbacks, setFeedbacks] = useLocalStorage<Feedback[]>('admin-feedbacks', [
    {
      id: '1',
      articleSlug: 'artikel-ai-sistem-akademik',
      articleTitle: 'AI dalam Sistem Akademik',
      name: 'Ahmad Rizki',
      feedback: 'Artikel yang sangat menarik tentang implementasi AI di sistem akademik. Saya rasa ini bisa diterapkan di universitas kami.',
      timestamp: new Date().toISOString(),
      status: 'pending',
      likes: 5
    },
    {
      id: '2',
      articleSlug: 'teknologi-blockchain-pendidikan',
      articleTitle: 'Blockchain dalam Pendidikan',
      name: 'Sari Dewi',
      feedback: 'Penjelasan blockchain untuk pendidikan sangat detail. Namun perlu contoh implementasi yang lebih konkret.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'approved',
      likes: 8
    },
    {
      id: '3',
      articleSlug: 'artikel-ai-sistem-akademik',
      articleTitle: 'AI dalam Sistem Akademik',
      name: 'Budi Santoso',
      feedback: 'Konten tidak relevan dan terlalu teknis.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'rejected',
      likes: 0
    }
  ]);
  
  const [settings, setSettings] = useLocalStorage<AdminSettings>('admin-settings', {
    maxFeedbackLength: 500,
    moderationEnabled: true,
    autoApproval: false,
    emailNotifications: true
  });
  
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    category: '',
    author: '',
    tags: '',
    image: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuth?.isAuthenticated) {
      navigate('/admin/login');
    }
  }, [adminAuth, navigate]);

  const handleLogout = () => {
    setAdminAuth(null);
    toast.success('Logout berhasil');
    navigate('/admin/login');
  };

  const handleSaveSettings = () => {
    setSettings({ ...settings });
    toast.success('Pengaturan berhasil disimpan!');
    
    // Apply settings effects
    if (settings.autoApproval && settings.moderationEnabled) {
      const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending');
      if (pendingFeedbacks.length > 0) {
        setFeedbacks(feedbacks.map(f => 
          f.status === 'pending' ? { ...f, status: 'approved' } : f
        ));
        toast.info(`${pendingFeedbacks.length} feedback otomatis disetujui`);
      }
    }
    
    if (settings.emailNotifications) {
      toast.info('Notifikasi email akan dikirim untuk feedback baru');
    }
  };

  const handleApproveFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId ? { ...f, status: 'approved' } : f
    ));
    toast.success('Feedback berhasil disetujui!');
  };

  const handleRejectFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId ? { ...f, status: 'rejected' } : f
    ));
    toast.success('Feedback berhasil ditolak!');
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.filter(f => f.id !== feedbackId));
    toast.success('Feedback berhasil dihapus!');
  };

  const handleCreateArticle = () => {
    if (!newArticle.title || !newArticle.description) {
      toast.error('Title dan description harus diisi');
      return;
    }

    const article: Article = {
      id: Date.now().toString(),
      slug: newArticle.title.toLowerCase().replace(/\s+/g, '-'),
      title: newArticle.title,
      description: newArticle.description,
      category: newArticle.category || 'Umum',
      author: newArticle.author || 'Admin BEM',
      publishDate: new Date().toISOString().split('T')[0],
      tags: newArticle.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      image: newArticle.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      content: 'Konten artikel...',
      readTime: 5,
      totalFeedbacks: 0,
      viewCount: 0
    };

    setArticles([...articles, article]);
    setNewArticle({
      title: '',
      description: '',
      category: '',
      author: '',
      tags: '',
      image: ''
    });
    toast.success('Artikel berhasil dibuat!');
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
    toast.success('Artikel berhasil dihapus!');
  };

  const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending');
  const approvedFeedbacks = feedbacks.filter(f => f.status === 'approved');
  const rejectedFeedbacks = feedbacks.filter(f => f.status === 'rejected');

  const stats = {
    totalArticles: articles.length,
    totalFeedbacks: feedbacks.length,
    pendingFeedbacks: pendingFeedbacks.length,
    approvedFeedbacks: approvedFeedbacks.length,
    totalViews: articles.reduce((sum, article) => sum + article.viewCount, 0),
    avgFeedbackPerArticle: Math.round(feedbacks.length / articles.length) || 0
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="default" className="bg-green-100 text-green-800">Disetujui</Badge>;
      case 'rejected': return <Badge variant="destructive">Ditolak</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
      default: return null;
    }
  };

  if (!adminAuth?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard Admin BEM</h1>
                <p className="text-sm text-gray-600">Selamat datang, {adminAuth.username}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Artikel</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFeedbacks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Feedback Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingFeedbacks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rata-rata Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgFeedbackPerArticle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Kelola Artikel</TabsTrigger>
            <TabsTrigger value="feedback">
              Kelola Feedback
              {stats.pendingFeedbacks > 0 && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                  {stats.pendingFeedbacks}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          {/* Articles Management */}
          <TabsContent value="articles" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Tambah Artikel Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Judul Artikel</Label>
                    <Input
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      placeholder="Masukkan judul artikel"
                    />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Input
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                      placeholder="Teknologi, Lingkungan, dll"
                    />
                  </div>
                  <div>
                    <Label>Penulis</Label>
                    <Input
                      value={newArticle.author}
                      onChange={(e) => setNewArticle({...newArticle, author: e.target.value})}
                      placeholder="Nama penulis"
                    />
                  </div>
                  <div>
                    <Label>Tags (pisahkan dengan koma)</Label>
                    <Input
                      value={newArticle.tags}
                      onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})}
                      placeholder="AI, Teknologi, Inovasi"
                    />
                  </div>
                </div>
                <div>
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={newArticle.description}
                    onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                    placeholder="Deskripsi singkat artikel"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>URL Gambar</Label>
                  <Input
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({...newArticle, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={handleCreateArticle} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Buat Artikel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Artikel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-gray-600">{article.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span className="text-xs text-gray-500">{article.author}</span>
                          <span className="text-xs text-gray-500">{article.totalFeedbacks} feedback</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/feedback/${article.slug}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingArticle(article)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Management */}
          <TabsContent value="feedback" className="space-y-6">
            {/* Pending Feedbacks */}
            {pendingFeedbacks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="w-5 h-5" />
                    Feedback Menunggu Persetujuan ({pendingFeedbacks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingFeedbacks.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg bg-yellow-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{feedback.name}</h4>
                              {getStatusBadge(feedback.status)}
                              <span className="text-xs text-gray-500">
                                {new Date(feedback.timestamp).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Artikel: <span className="font-medium">{feedback.articleTitle}</span>
                            </p>
                            <p className="text-sm text-gray-800">{feedback.feedback}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">{feedback.likes} likes</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleApproveFeedback(feedback.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectFeedback(feedback.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle>Semua Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada feedback yang tersedia</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{feedback.name}</h4>
                              {getStatusIcon(feedback.status)}
                              {getStatusBadge(feedback.status)}
                              <span className="text-xs text-gray-500">
                                {new Date(feedback.timestamp).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Artikel: <span className="font-medium">{feedback.articleTitle}</span>
                            </p>
                            <p className="text-sm text-gray-800">{feedback.feedback}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">{feedback.likes} likes</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {feedback.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveFeedback(feedback.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRejectFeedback(feedback.id)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Pengaturan Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Maksimal Karakter Feedback</Label>
                  <Input
                    type="number"
                    value={settings.maxFeedbackLength}
                    onChange={(e) => setSettings({...settings, maxFeedbackLength: parseInt(e.target.value)})}
                    min="100"
                    max="2000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Saat ini: {settings.maxFeedbackLength} karakter
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Moderasi Feedback</h4>
                      <p className="text-sm text-gray-600">Aktifkan moderasi manual untuk feedback baru</p>
                    </div>
                    <Button
                      variant={settings.moderationEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({...settings, moderationEnabled: !settings.moderationEnabled})}
                      className={settings.moderationEnabled ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {settings.moderationEnabled ? 'Aktif' : 'Nonaktif'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto Approval</h4>
                      <p className="text-sm text-gray-600">Feedback otomatis disetujui tanpa moderasi</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        ⚠️ Hanya berlaku jika moderasi diaktifkan
                      </p>
                    </div>
                    <Button
                      variant={settings.autoApproval ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({...settings, autoApproval: !settings.autoApproval})}
                      disabled={!settings.moderationEnabled}
                      className={settings.autoApproval ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {settings.autoApproval ? 'Aktif' : 'Nonaktif'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notifikasi Email</h4>
                      <p className="text-sm text-gray-600">Terima notifikasi email untuk feedback baru</p>
                    </div>
                    <Button
                      variant={settings.emailNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                      className={settings.emailNotifications ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {settings.emailNotifications ? 'Aktif' : 'Nonaktif'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4" />
                    Simpan Pengaturan
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Pengaturan akan berlaku setelah disimpan dan mempengaruhi feedback baru.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
