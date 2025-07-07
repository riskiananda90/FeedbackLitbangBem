import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Shield, FileText, MessageSquare, Settings, BarChart3, Users, Edit3, Trash2, Plus, LogOut, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Upload, Link2, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
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
  const [feedbacks, setFeedbacks] = useLocalStorage<Feedback[]>('admin-feedbacks', [{
    id: '1',
    articleSlug: 'artikel-ai-sistem-akademik',
    articleTitle: 'AI dalam Sistem Akademik',
    name: 'Ahmad Rizki',
    feedback: 'Artikel yang sangat menarik tentang implementasi AI di sistem akademik. Saya rasa ini bisa diterapkan di universitas kami.',
    timestamp: new Date().toISOString(),
    status: 'pending',
    likes: 5
  }, {
    id: '2',
    articleSlug: 'teknologi-blockchain-pendidikan',
    articleTitle: 'Blockchain dalam Pendidikan',
    name: 'Sari Dewi',
    feedback: 'Penjelasan blockchain untuk pendidikan sangat detail. Namun perlu contoh implementasi yang lebih konkret.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
    likes: 8
  }, {
    id: '3',
    articleSlug: 'artikel-ai-sistem-akademik',
    articleTitle: 'AI dalam Sistem Akademik',
    name: 'Budi Santoso',
    feedback: 'Konten tidak relevan dan terlalu teknis.',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'rejected',
    likes: 0
  }]);
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
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImageUploadType, setEditImageUploadType] = useState<'url' | 'file'>('url');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
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
    setSettings({
      ...settings
    });
    toast.success('Pengaturan berhasil disimpan!');

    // Apply settings effects
    if (settings.autoApproval && settings.moderationEnabled) {
      const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending');
      if (pendingFeedbacks.length > 0) {
        setFeedbacks(feedbacks.map(f => f.status === 'pending' ? {
          ...f,
          status: 'approved'
        } : f));
        toast.info(`${pendingFeedbacks.length} feedback otomatis disetujui`);
      }
    }
    if (settings.emailNotifications) {
      toast.info('Notifikasi email akan dikirim untuk feedback baru');
    }
  };
  const handleApproveFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => f.id === feedbackId ? {
      ...f,
      status: 'approved'
    } : f));
    toast.success('Feedback berhasil disetujui!');
  };
  const handleRejectFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => f.id === feedbackId ? {
      ...f,
      status: 'rejected'
    } : f));
    toast.success('Feedback berhasil ditolak!');
  };
  const handleDeleteFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.filter(f => f.id !== feedbackId));
    toast.success('Feedback berhasil dihapus!');
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const imageDataUrl = event.target?.result as string;
        setNewArticle({
          ...newArticle,
          image: imageDataUrl
        });
        setImagePreview(imageDataUrl);
        toast.success('Gambar berhasil diupload!');
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageUrlChange = (url: string) => {
    setNewArticle({
      ...newArticle,
      image: url
    });
    setImagePreview(url);
  };
  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const imageDataUrl = event.target?.result as string;
        if (editingArticle) {
          setEditingArticle({
            ...editingArticle,
            image: imageDataUrl
          });
          setEditImagePreview(imageDataUrl);
          toast.success('Gambar berhasil diupload!');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditImageUrlChange = (url: string) => {
    if (editingArticle) {
      setEditingArticle({
        ...editingArticle,
        image: url
      });
      setEditImagePreview(url);
    }
  };
  const handleSaveEdit = () => {
    if (!editingArticle) return;
    if (!editingArticle.title || !editingArticle.description) {
      toast.error('Title dan description harus diisi');
      return;
    }
    const updatedArticles = articles.map(article => article.id === editingArticle.id ? editingArticle : article);
    setArticles(updatedArticles);
    setEditingArticle(null);
    setEditImagePreview('');
    toast.success('Artikel berhasil diperbarui!');
  };
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setEditImagePreview('');
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
    setImagePreview('');
    toast.success('Artikel berhasil dibuat!');
  };
  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
    toast.success('Artikel berhasil dihapus!');
  };
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
      default:
        return null;
    }
  };
  if (!adminAuth?.isAuthenticated) {
    return null;
  }
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 font-bold text-base">Dashboard Admin BEM</h1>
                <p className="text-gray-600 text-xs">Selamat datang, {adminAuth.username}</p>
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
        <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600">Total Artikel</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600">Total Feedback</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalFeedbacks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600">Feedback Pending</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.pendingFeedbacks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600">Rata-rata Feedback</p>
                  <p className="sm:text-xl lg:text-2xl font-bold text-gray-900 text-sm">{stats.avgFeedbackPerArticle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles" className="text-sm">Kelola Artikel</TabsTrigger>
            <TabsTrigger value="feedback" className="text-sm">
              Kelola Feedback
              {stats.pendingFeedbacks > 0 && <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                  {stats.pendingFeedbacks}
                </Badge>}
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">Pengaturan</TabsTrigger>
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
                    <Input value={newArticle.title} onChange={e => setNewArticle({
                    ...newArticle,
                    title: e.target.value
                  })} placeholder="Masukkan judul artikel" />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Input value={newArticle.category} onChange={e => setNewArticle({
                    ...newArticle,
                    category: e.target.value
                  })} placeholder="Teknologi, Lingkungan, dll" />
                  </div>
                  <div>
                    <Label>Penulis</Label>
                    <Input value={newArticle.author} onChange={e => setNewArticle({
                    ...newArticle,
                    author: e.target.value
                  })} placeholder="Nama penulis" />
                  </div>
                  <div>
                    <Label>Tags (pisahkan dengan koma)</Label>
                    <Input value={newArticle.tags} onChange={e => setNewArticle({
                    ...newArticle,
                    tags: e.target.value
                  })} placeholder="AI, Teknologi, Inovasi" />
                  </div>
                </div>
                <div>
                  <Label>Deskripsi</Label>
                  <Textarea value={newArticle.description} onChange={e => setNewArticle({
                  ...newArticle,
                  description: e.target.value
                })} placeholder="Deskripsi singkat artikel" rows={3} />
                </div>
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Gambar Artikel</Label>
                  
                  {/* Upload Type Selector */}
                  <div className="flex gap-2">
                    <Button type="button" variant={imageUploadType === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setImageUploadType('url')} className="gap-2">
                      <Link2 className="w-4 h-4" />
                      URL Gambar
                    </Button>
                    <Button type="button" variant={imageUploadType === 'file' ? 'default' : 'outline'} size="sm" onClick={() => setImageUploadType('file')} className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </Button>
                  </div>

                  {/* URL Input */}
                  {imageUploadType === 'url' && <div>
                      <Input value={newArticle.image} onChange={e => handleImageUrlChange(e.target.value)} placeholder="https://example.com/image.jpg" className="mt-2" />
                    </div>}

                  {/* File Upload */}
                  {imageUploadType === 'file' && <div>
                      <Input type="file" accept="image/*" onChange={handleFileUpload} className="mt-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Maksimal 5MB. Format: JPG, PNG, GIF, WebP
                      </p>
                    </div>}

                  {/* Image Preview */}
                  {(imagePreview || newArticle.image) && <div className="mt-4">
                      <Label className="text-sm text-gray-600">Preview Gambar:</Label>
                      <div className="mt-2 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <img src={imagePreview || newArticle.image} alt="Preview" className="max-w-full h-32 object-cover rounded-lg mx-auto" onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                      </div>
                    </div>}
                </div>
                <Button onClick={handleCreateArticle} className="gap-2 bg-gray-900 hover:bg-gray-800 text-white">
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
                  {articles.map(article => <div key={article.id} className="relative p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {truncateText(article.description, 120)}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{article.author}</span>
                            <span className="text-xs text-gray-500">
                              {article.totalFeedbacks} feedback
                            </span>
                          </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden sm:flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/feedback/${article.slug}`)} className="gap-1">
                            <Eye className="w-4 h-4" />
                            <span className="hidden md:inline">Lihat</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingArticle(article)} className="gap-1">
                            <Edit3 className="w-4 h-4" />
                            <span className="hidden md:inline">Edit</span>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteArticle(article.id)} className="gap-1">
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline">Hapus</span>
                          </Button>
                        </div>

                        {/* Mobile 3-dot Menu */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white border shadow-lg z-50">
                              <DropdownMenuItem onClick={() => navigate(`/feedback/${article.slug}`)} className="gap-2 cursor-pointer">
                                <Eye className="w-4 h-4" />
                                Lihat
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditingArticle(article)} className="gap-2 cursor-pointer">
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteArticle(article.id)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Management */}
          <TabsContent value="feedback" className="space-y-6">
            {/* Pending Feedbacks */}
            {pendingFeedbacks.length > 0 && <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="w-5 h-5" />
                    Feedback Menunggu Persetujuan ({pendingFeedbacks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingFeedbacks.map(feedback => <div key={feedback.id} className="p-4 border rounded-lg bg-yellow-50">
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
                            <Button size="sm" onClick={() => handleApproveFeedback(feedback.id)} className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRejectFeedback(feedback.id)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteFeedback(feedback.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}

            {/* All Feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle>Semua Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbacks.length === 0 ? <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada feedback yang tersedia</p>
                  </div> : <div className="space-y-4">
                    {feedbacks.map(feedback => <div key={feedback.id} className="p-4 border rounded-lg">
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
                            {feedback.status === 'pending' && <>
                                <Button size="sm" onClick={() => handleApproveFeedback(feedback.id)} className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleRejectFeedback(feedback.id)}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>}
                            <Button variant="outline" size="sm" onClick={() => handleDeleteFeedback(feedback.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="w-5 h-5" />
                  Pengaturan Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Maksimal Karakter Feedback</Label>
                  <Input type="number" value={settings.maxFeedbackLength} onChange={e => setSettings({
                  ...settings,
                  maxFeedbackLength: parseInt(e.target.value)
                })} min="100" max="2000" />
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
                    <Button variant={settings.moderationEnabled ? "default" : "outline"} size="sm" onClick={() => setSettings({
                    ...settings,
                    moderationEnabled: !settings.moderationEnabled
                  })} className={settings.moderationEnabled ? "bg-blue-600 hover:bg-blue-700" : ""}>
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
                    <Button variant={settings.autoApproval ? "default" : "outline"} size="sm" onClick={() => setSettings({
                    ...settings,
                    autoApproval: !settings.autoApproval
                  })} disabled={!settings.moderationEnabled} className={settings.autoApproval ? "bg-blue-600 hover:bg-blue-700" : ""}>
                      {settings.autoApproval ? 'Aktif' : 'Nonaktif'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notifikasi Email</h4>
                      <p className="text-sm text-gray-600">Terima notifikasi email untuk feedback baru</p>
                    </div>
                    <Button variant={settings.emailNotifications ? "default" : "outline"} size="sm" onClick={() => setSettings({
                    ...settings,
                    emailNotifications: !settings.emailNotifications
                  })} className={settings.emailNotifications ? "bg-blue-600 hover:bg-blue-700" : ""}>
                      {settings.emailNotifications ? 'Aktif' : 'Nonaktif'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings} className="gap-2 bg-gray-900 hover:bg-gray-800 text-white">
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

        {/* Edit Article Dialog */}
        {editingArticle && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Edit Artikel</h2>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Judul Artikel</Label>
                      <Input value={editingArticle.title} onChange={e => setEditingArticle({
                    ...editingArticle,
                    title: e.target.value
                  })} placeholder="Masukkan judul artikel" />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Input value={editingArticle.category} onChange={e => setEditingArticle({
                    ...editingArticle,
                    category: e.target.value
                  })} placeholder="Teknologi, Lingkungan, dll" />
                    </div>
                    <div>
                      <Label>Penulis</Label>
                      <Input value={editingArticle.author} onChange={e => setEditingArticle({
                    ...editingArticle,
                    author: e.target.value
                  })} placeholder="Nama penulis" />
                    </div>
                    <div>
                      <Label>Tags (pisahkan dengan koma)</Label>
                      <Input value={Array.isArray(editingArticle.tags) ? editingArticle.tags.join(', ') : ''} onChange={e => setEditingArticle({
                    ...editingArticle,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })} placeholder="AI, Teknologi, Inovasi" />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Deskripsi</Label>
                    <Textarea value={editingArticle.description} onChange={e => setEditingArticle({
                  ...editingArticle,
                  description: e.target.value
                })} placeholder="Deskripsi singkat artikel" rows={3} />
                  </div>

                  {/* Edit Image Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Gambar Artikel</Label>
                    
                    {/* Upload Type Selector */}
                    <div className="flex gap-2">
                      <Button type="button" variant={editImageUploadType === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setEditImageUploadType('url')} className="gap-2">
                        <Link2 className="w-4 h-4" />
                        URL Gambar
                      </Button>
                      <Button type="button" variant={editImageUploadType === 'file' ? 'default' : 'outline'} size="sm" onClick={() => setEditImageUploadType('file')} className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload File
                      </Button>
                    </div>

                    {/* URL Input */}
                    {editImageUploadType === 'url' && <div>
                        <Input value={editingArticle.image} onChange={e => handleEditImageUrlChange(e.target.value)} placeholder="https://example.com/image.jpg" className="mt-2" />
                      </div>}

                    {/* File Upload */}
                    {editImageUploadType === 'file' && <div>
                        <Input type="file" accept="image/*" onChange={handleEditFileUpload} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Maksimal 5MB. Format: JPG, PNG, GIF, WebP
                        </p>
                      </div>}

                    {/* Current Image Preview */}
                    {(editImagePreview || editingArticle.image) && <div className="mt-4">
                        <Label className="text-sm text-gray-600">Preview Gambar:</Label>
                        <div className="mt-2 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                          <img src={editImagePreview || editingArticle.image} alt="Preview" className="max-w-full h-32 object-cover rounded-lg mx-auto" onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                        </div>
                      </div>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveEdit} className="gap-2 bg-gray-900 hover:bg-gray-800 text-white flex-1">
                      <CheckCircle className="w-4 h-4" />
                      Simpan Perubahan
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                      <XCircle className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default AdminDashboard;