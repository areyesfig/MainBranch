export interface NewsArticle {
  id: string;
  sourceId: string;
  title: string;
  summary: string;
  titleEs?: string;
  summaryEs?: string;
  content: string;
  author?: string;
  sourceUrl: string;
  sourceName: string;
  topic?: string;
  tags?: string[];
  imageUrl?: string;
  votes?: number;
  publishedAt: Date;
}
