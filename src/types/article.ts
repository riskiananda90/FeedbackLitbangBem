
export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishDate: string;
  tags: string[];
  description: string;
  image: string;
  content: string;
  readTime: number;
  totalFeedbacks: number;
  viewCount: number;
}

export interface ArticleContextualFeedback {
  id: number;
  name: string;
  feedback: string;
  likes: number;
  timestamp: Date;
  category: string;
  sentiment: string;
  likedBy?: string[];
  articleId: string;
  relevanceScore: number;
  tags: string[];
}
