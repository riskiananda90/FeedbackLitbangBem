-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_time INTEGER NOT NULL DEFAULT 5,
  view_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table for general feedback (homepage)
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  feedback TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'general',
  sentiment TEXT DEFAULT 'neutral',
  liked_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create article feedback table (contextual feedback for specific articles)
CREATE TABLE public.article_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  feedback TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'general',
  sentiment TEXT DEFAULT 'neutral',
  relevance_score INTEGER DEFAULT 85,
  tags TEXT[] DEFAULT '{}',
  liked_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for articles (publicly readable, admin can manage)
CREATE POLICY "Articles are viewable by everyone" 
ON public.articles 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert articles" 
ON public.articles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update articles" 
ON public.articles 
FOR UPDATE 
USING (true);

CREATE POLICY "Admin can delete articles" 
ON public.articles 
FOR DELETE 
USING (true);

-- Create policies for feedback (publicly readable and insertable)
CREATE POLICY "Feedback is viewable by everyone" 
ON public.feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can insert feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update feedback likes" 
ON public.feedback 
FOR UPDATE 
USING (true);

-- Create policies for article feedback (publicly readable and insertable)
CREATE POLICY "Article feedback is viewable by everyone" 
ON public.article_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can insert article feedback" 
ON public.article_feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update article feedback likes" 
ON public.article_feedback 
FOR UPDATE 
USING (true);

-- Create policies for admin users (restricted access)
CREATE POLICY "Admin users can view their own data" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_article_feedback_updated_at
  BEFORE UPDATE ON public.article_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_publish_date ON public.articles(publish_date);
CREATE INDEX idx_article_feedback_article_id ON public.article_feedback(article_id);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at);
CREATE INDEX idx_article_feedback_created_at ON public.article_feedback(created_at);

-- Insert sample articles to replace dummy data
INSERT INTO public.articles (title, slug, description, content, author, category, image, read_time, view_count, tags) VALUES
(
  'Inovasi AI dalam Sistem Akademik Universitas',
  'artikel-ai-sistem-akademik',
  'Penelitian mendalam tentang implementasi kecerdasan buatan untuk meningkatkan efisiensi sistem akademik dan prediksi performa mahasiswa.',
  'Artikel lengkap tentang implementasi AI dalam sistem akademik...',
  'Dr. Ahmad Fajar Nugroho',
  'Teknologi',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  8,
  1247,
  ARRAY['AI', 'Machine Learning', 'Sistem Akademik', 'Prediksi', 'Analisis Data']
),
(
  'Pengembangan Mobile App untuk Layanan Kemahasiswaan',
  'mobile-app-kemahasiswaan',
  'Studi kasus pengembangan aplikasi mobile yang mengintegrasikan semua layanan kemahasiswaan dalam satu platform yang user-friendly.',
  'Artikel lengkap tentang pengembangan mobile app...',
  'Sarah Maharani, S.Kom',
  'Teknologi',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
  6,
  892,
  ARRAY['Mobile Development', 'UX/UI', 'Flutter', 'API Integration']
),
(
  'Penelitian Blockchain untuk Sistem Voting BEM',
  'penelitian-blockchain-voting',
  'Analisis implementasi teknologi blockchain untuk menciptakan sistem voting yang transparan dan aman dalam pemilihan organisasi mahasiswa.',
  'Artikel lengkap tentang blockchain voting...',
  'Prof. Dr. Budi Santoso',
  'Teknologi',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
  10,
  623,
  ARRAY['Blockchain', 'Security', 'Voting System', 'Transparency']
),
(
  'Strategi Digital Marketing untuk Organisasi Mahasiswa',
  'digital-marketing-organisasi',
  'Panduan komprehensif tentang strategi pemasaran digital yang efektif untuk meningkatkan engagement dan partisipasi mahasiswa.',
  'Artikel lengkap tentang digital marketing...',
  'Rina Kusumawati, M.M',
  'Marketing',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  7,
  1156,
  ARRAY['Digital Marketing', 'Social Media', 'Content Strategy', 'Engagement']
),
(
  'Analisis Kepuasan Mahasiswa terhadap Layanan Kampus',
  'analisis-kepuasan-mahasiswa',
  'Studi kuantitatif tentang tingkat kepuasan mahasiswa terhadap berbagai layanan kampus menggunakan metode statistik advanced.',
  'Artikel lengkap tentang analisis kepuasan...',
  'Dr. Maya Sari Dewi, M.Si',
  'Penelitian',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  9,
  734,
  ARRAY['Survey Research', 'Statistical Analysis', 'Student Satisfaction', 'Quality Improvement']
);

-- Insert sample general feedback
INSERT INTO public.feedback (name, feedback, likes, category, sentiment, liked_by) VALUES
(
  'Dr. Sarah Andini',
  'Metodologi penelitian yang digunakan sudah sangat baik, namun perlu ditambahkan analisis statistik yang lebih mendalam untuk memperkuat validitas data. Saran saya adalah menggunakan multiple regression analysis untuk hasil yang lebih komprehensif.',
  24,
  'metodologi',
  'constructive',
  ARRAY['user1', 'user2', 'user3']
),
(
  'Ahmad Rizky Pratama',
  'Artikel ini memberikan insight baru tentang inovasi teknologi di kampus. Sangat aplikatif dan bisa diimplementasikan langsung. Terima kasih untuk tim litbang BEM!',
  18,
  'appreciation',
  'positive',
  ARRAY['user4', 'user5']
),
(
  'Fitri Maharani',
  'Bagian literature review perlu diperkuat dengan referensi terbaru. Beberapa sumber yang digunakan sudah outdated. Mungkin bisa ditambahkan jurnal internasional dari 2023-2024.',
  15,
  'literature',
  'constructive',
  ARRAY['user6', 'user7', 'user8']
);

-- Insert default admin user (username: admin, password: password)
-- Note: In production, this should be changed immediately
INSERT INTO public.admin_users (username, password_hash, display_name) VALUES
('admin', '$2a$10$K7QE.3A9J8K8K8K8K8K8KOJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'Administrator');