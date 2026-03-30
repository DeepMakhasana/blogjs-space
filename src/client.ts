import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client";

import fetch from "cross-fetch";
import { Blog, BlogClientOptions, PaginationOptions, PaginatedResult } from "./types";
import { GET_BLOG_BY_SLUG, SEARCH_BLOGS } from "./queries";

type SearchBlogsQueryResult = {
  blogs: Blog[];
  blogsCount: number;
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

  async getBlogs(
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Blog>> {
    const page = Math.max(pagination.page ?? 1, 1);
    const limit = Math.max(Math.min(pagination.limit ?? 10, 100), 1);
    const skip = (page - 1) * limit;
    const query = (pagination.query ?? "").trim().replace(/\s+/g, " ");

    const { data } = await this.client.query<SearchBlogsQueryResult>({
      query: SEARCH_BLOGS,
      variables: {
        query,
        skip,
        take: limit
      }
    });

    const blogs = data?.blogs ?? [];
    const total = data?.blogsCount ?? 0;
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


  async getBlogBySlug(slug: string): Promise<(Blog & { content?: string }) | null> {

    const { data } = await this.client.query<BlogBySlugQueryResult>({
      query: GET_BLOG_BY_SLUG,
      variables: { slug }
    });

    return data?.blogs?.[0] || null;
  }
}