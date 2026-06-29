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
  private endpoint: string = "https://blogapi.deepmakhasana.me/api/graphql";
  private apiKey: string;

  constructor(options: BlogClientOptions) {
    this.apiKey = options.apiKey;
  }

  private async request<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: this.apiKey
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      const details = await response.text();
      const suffix = details ? `: ${details}` : "";
      throw new Error(
        `GraphQL request failed with ${response.status} ${response.statusText}${suffix}`
      );
    }

    const payload = (await response.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };

    if (payload.errors?.length) {
      const message = payload.errors.map((error) => error.message).join("; ");
      throw new Error(`GraphQL errors: ${message}`);
    }

    if (!payload.data) {
      throw new Error("GraphQL response missing data.");
    }

    return payload.data;
  }

  async getBlogs(
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Blog>> {
    const page = Math.max(pagination.page ?? 1, 1);
    const limit = Math.max(Math.min(pagination.limit ?? 10, 100), 1);
    const skip = (page - 1) * limit;
    const query = (pagination.query ?? "").trim().replace(/\s+/g, " ");

    const data = await this.request<SearchBlogsQueryResult>(SEARCH_BLOGS, {
      query,
      skip,
      take: limit
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

    const data = await this.request<BlogBySlugQueryResult>(GET_BLOG_BY_SLUG, {
      slug
    });

    return data?.blogs?.[0] || null;
  }
}