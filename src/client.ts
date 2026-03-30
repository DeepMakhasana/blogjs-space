import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client";

import fetch from "cross-fetch";
import { Blog, BlogClientOptions, PaginationOptions, PaginatedResult } from "./types";
import { GET_BLOGS, GET_BLOG_BY_SLUG, SEARCH_BLOGS } from "./queries";

type BlogsQueryResult = {
  blogs: Blog[];
};

type SearchBlogsQueryResult = {
  blogs: Blog[];
  blogsConnection: {
    aggregate: {
      count: number;
    };
  };
};

type BlogBySlugQueryResult = {
  blogs: Array<Blog & { content?: string }>;
};

export class BlogClient {

  private client: ApolloClient;

  constructor(options: BlogClientOptions) {

    const link = new HttpLink({
      uri: options.endpoint,
      fetch,
      headers: {
        Authorization: options.apiKey
      }
    });

    this.client = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
  }

  async getBlogs(): Promise<Blog[]> {
    const { data } = await this.client.query<BlogsQueryResult>({
      query: GET_BLOGS
    });

    return data?.blogs ?? [];
  }

  async getBlogBySlug(slug: string): Promise<(Blog & { content?: string }) | null> {

    const { data } = await this.client.query<BlogBySlugQueryResult>({
      query: GET_BLOG_BY_SLUG,
      variables: { slug }
    });

    return data?.blogs?.[0] || null;
  }

  async searchBlogs(
    query?: string,
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Blog>> {
    const page = Math.max(pagination.page ?? 1, 1);
    const limit = Math.max(Math.min(pagination.limit ?? 10, 100), 1);
    const skip = (page - 1) * limit;

    const { data } = await this.client.query<SearchBlogsQueryResult>({
      query: SEARCH_BLOGS,
      variables: {
        query: query ?? "",
        skip,
        take: limit
      }
    });

    const blogs = data?.blogs ?? [];
    const total = data?.blogsConnection?.aggregate?.count ?? 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    };
  }
}