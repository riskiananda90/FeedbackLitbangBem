import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';

export const getAllArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    author: article.author,
    category: article.category,
    image: article.image,
    publishDate: article.publish_date,
    readTime: article.read_time,
    viewCount: article.view_count,
    totalFeedbacks: 0, // Will be calculated separately
    tags: article.tags || []
  }));
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching article:', error);
    return null;
  }

  // Get feedback count for this article
  const { count } = await supabase
    .from('article_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', data.id);

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    content: data.content,
    author: data.author,
    category: data.category,
    image: data.image,
    publishDate: data.publish_date,
    readTime: data.read_time,
    viewCount: data.view_count,
    totalFeedbacks: count || 0,
    tags: data.tags || []
  };
};

export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }

  return data.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    author: article.author,
    category: article.category,
    image: article.image,
    publishDate: article.publish_date,
    readTime: article.read_time,
    viewCount: article.view_count,
    totalFeedbacks: 0, // Will be calculated separately
    tags: article.tags || []
  }));
};