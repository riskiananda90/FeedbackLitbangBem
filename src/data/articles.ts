
import { Article } from '@/types/article';

export const articles: Record<string, Article> = {
  'artikel-ai-sistem-akademik': {
    id: 'artikel-ai-sistem-akademik',
    slug: 'artikel-ai-sistem-akademik',
    title: 'Implementasi AI dalam Sistem Akademik',
    category: 'Teknologi',
    author: 'Tim Litbang BEM',
    publishDate: '2025-01-15',
    tags: ['AI', 'Machine Learning', 'Akademik', 'Teknologi'],
    description: 'Penelitian mendalam tentang penerapan kecerdasan buatan dalam sistem akademik kampus untuk meningkatkan efisiensi dan kualitas pembelajaran.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    content: 'Artikel lengkap tentang implementasi AI...',
    readTime: 8,
    totalFeedbacks: 45,
    viewCount: 1240
  },
  'mobile-app-kemahasiswaan': {
    id: 'mobile-app-kemahasiswaan',
    slug: 'mobile-app-kemahasiswaan',
    title: 'Aplikasi Mobile untuk Layanan Kemahasiswaan',
    category: 'Mobile Development',
    author: 'Divisi IT BEM',
    publishDate: '2025-01-10',
    tags: ['Mobile App', 'React Native', 'UX/UI', 'Kemahasiswaan'],
    description: 'Konsep dan prototype aplikasi mobile yang memudahkan mahasiswa mengakses berbagai layanan kemahasiswaan dalam satu platform.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    content: 'Artikel lengkap tentang mobile app...',
    readTime: 6,
    totalFeedbacks: 32,
    viewCount: 890
  },
  'penelitian-blockchain-voting': {
    id: 'penelitian-blockchain-voting',
    slug: 'penelitian-blockchain-voting',
    title: 'Sistem Voting Blockchain untuk Pemilihan BEM',
    category: 'Blockchain',
    author: 'Research Team BEM',
    publishDate: '2025-01-05',
    tags: ['Blockchain', 'Voting', 'Security', 'Democracy'],
    description: 'Studi kelayakan implementasi teknologi blockchain untuk sistem pemilihan yang lebih transparan dan aman dalam lingkungan kampus.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    content: 'Artikel lengkap tentang blockchain voting...',
    readTime: 10,
    totalFeedbacks: 28,
    viewCount: 756
  }
};

export const getArticleBySlug = (slug: string): Article | null => {
  return articles[slug] || null;
};

export const getAllArticles = (): Article[] => {
  return Object.values(articles);
};
