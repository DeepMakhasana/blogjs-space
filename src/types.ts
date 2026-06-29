export interface Blog {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: {
    url?: string | null;
  } | null;
  readTime?: number;
  publishedAt?: string;
  author: {
    name: string;
  };
  categories?: {
    name: string;
  };
  tags?: {
    name: string;
  }[];
}

export interface BlogClientOptions {
  apiKey: string;
}

export interface PaginationOptions {
  page?: number; // 1-indexed, defaults to 1
  limit?: number; // items per page, defaults to 10
  query?: string; // search query, optional
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}