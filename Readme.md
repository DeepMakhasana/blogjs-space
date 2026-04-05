# WriterJS - Blog Client SDK

A lightweight, type-safe GraphQL client for fetching blogs from WriterJS CMS. Supports advanced search, pagination, and filtering with a clean, modern API.

## Features

- 🔍 **Full-Text Search** — Search across blog title, description, and slug fields
- 🔤 **Case-Insensitive Search** — Find blogs regardless of letter casing
- 📖 **Pagination Support** — Built-in offset-based pagination with metadata
- 🏷️ **Slug-Based Retrieval** — Quickly fetch individual blogs by slug
- 📦 **TypeScript Support** — Fully typed API with comprehensive type definitions
- ⚡ **Apollo Client Integration** — Leverages Apollo Client for GraphQL queries

## Installation

```bash
npm install writerjs
```

## Getting Started

### Initialize the Client

```typescript
import { BlogClient } from "writerjs";

const client = new BlogClient({
  endpoint: "http://localhost:3000/api/graphql",
  apiKey: "d0178214-0141-44e2-8d8f-6576ea522c20"
});
```

## Usage

### Get All Blogs (with default pagination)

Returns the first 10 blogs ordered by creation date (newest first):

```typescript
const result = await client.getBlogs();

console.log(result.data);           // Blog[]
console.log(result.pagination.total); // Total number of blogs
```

### Search Blogs (case-insensitive)

Search across blog titles, descriptions, and slugs. Search is case-insensitive by default:

```typescript
const result = await client.getBlogs({
  query: "typescript",  // Searches: "Typescript", "TYPESCRIPT", "typescript"
  page: 1,
  limit: 10
});

console.log(result.data);  // Matching blogs array
```

### Retrieve Specific Blog by Slug

Fetch a single blog along with its full content:

```typescript
const blog = await client.getBlogBySlug("first-blog");

if (blog) {
  console.log(blog.title);
  console.log(blog.content);  // Full blog content
}
```

### Advanced Pagination

```typescript
const result = await client.getBlogs({
  query: "react",
  page: 2,
  limit: 20
});

// Response structure:
{
  data: Blog[],
  pagination: {
    page: 2,              // Current page
    limit: 20,            // Items per page
    total: 125,           // Total blogs matching query
    totalPages: 7,        // Total pages available
    hasMore: true         // Whether more pages exist
  }
}
```

## API Reference

### `getBlogs(pagination?: PaginationOptions): Promise<PaginatedResult<Blog>>`

Fetch blogs with optional search and pagination.

**Parameters:**
- `pagination.query?` (string) — Optional search term (searches title, description, slug)
- `pagination.page?` (number) — 1-indexed page number (default: 1)
- `pagination.limit?` (number) — Items per page, max 100 (default: 10)

**Returns:** `PaginatedResult<Blog>` with blogs array and pagination metadata

---

### `getBlogBySlug(slug: string): Promise<Blog & { content?: string } | null>`

Fetch a specific blog by its slug with full content.

**Parameters:**
- `slug` (string) — The blog's URL-friendly slug identifier

**Returns:** Blog object with content field, or null if not found

---

### Types

```typescript
interface Blog {
  id: string;
  title: string;
  slug: string;
  descroption?: string;
  image?: string;
  readTime?: number;
  publishedAt?: string;
}

interface PaginationOptions {
  page?: number;        // 1-indexed (default: 1)
  limit?: number;       // Items per page, max 100 (default: 10)
  query?: string;       // Full-text search term (optional)
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

## Examples

### Example 1: Fetch Latest 5 Blogs

```typescript
const result = await client.getBlogs({ limit: 5 });
console.log(result.data);  // 5 most recent blogs
```

### Example 2: Search with Pagination

```typescript
const result = await client.getBlogs({
  query: "nodejs",
  page: 1,
  limit: 15
});

console.log(result.data);              // First 15 Node.js related blogs
console.log(result.pagination.total);  // Total matching blogs
console.log(result.pagination.hasMore); // Check if more pages available
```

### Example 3: Handle Pagination UI

```typescript
async function loadMoreBlogs(currentPage: number) {
  const result = await client.getBlogs({
    query: "design",
    page: currentPage,
    limit: 10
  });

  if (result.pagination.hasMore) {
    // Show "Load More" button
  }

  return result.data;
}
```

## Search Behavior

- **Case-Insensitive** — Queries are matched regardless of letter casing
- **Multi-Field** — Searches across title, description, and slug
- **Whitespace Normalization** — Extra spaces are automatically cleaned
- **Partial Matching** — Returns blogs that contain the search term anywhere in the indexed fields

## Error Handling

```typescript
try {
  const result = await client.getBlogs({ query: "react" });
} catch (error) {
  console.error("Failed to fetch blogs:", error);
}
```

## License

MIT