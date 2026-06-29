# blogjs-space

A lightweight, type-safe JavaScript/TypeScript SDK for fetching blog content from [blogjs.space](https://blogjs.space) and easily retrieve blogs, search content, and paginate results using a simple API.

## Features

* 🚀 Simple setup with an API key
* 🔍 Search blogs by title, description, or slug
* 📄 Built-in pagination
* 🏷️ Fetch blogs by slug
* 📦 Fully typed with TypeScript
* ⚡ Powered by GraphQL & Apollo Client

---

## Installation

```bash
npm install blogjs-space
```

---

## Quick Start

```ts
import { BlogClient } from "blogjs-space";

const client = new BlogClient({
  apiKey: "YOUR_API_KEY",
});
```

---

## Usage

### Get Latest Blogs

```ts
const blogs = await client.getBlogs();

console.log(blogs.data);
console.log(blogs.pagination);
```

---

### Search Blogs

```ts
const blogs = await client.getBlogs({
  query: "react",
  page: 1,
  limit: 10,
});

console.log(blogs.data);
```

Search is case-insensitive and matches:

* Title
* Description
* Slug

---

### Get a Blog by Slug

```ts
const blog = await client.getBlogBySlug("my-first-blog");

if (blog) {
  console.log(blog.title);
  console.log(blog.content);
}
```

---

## Pagination

```ts
const result = await client.getBlogs({
  page: 2,
  limit: 20,
});
```

Example response:

```ts
{
  data: [...],
  pagination: {
    page: 2,
    limit: 20,
    total: 125,
    totalPages: 7,
    hasMore: true
  }
}
```

---

# API

## `getBlogs(options?)`

Fetch blogs with optional pagination and search.

```ts
await client.getBlogs({
  query?: string,
  page?: number,
  limit?: number
});
```

| Option  | Type     | Default | Description                           |
| ------- | -------- | ------- | ------------------------------------- |
| `query` | `string` | -       | Search by title, description, or slug |
| `page`  | `number` | `1`     | Page number                           |
| `limit` | `number` | `10`    | Blogs per page (max `100`)            |

Returns:

```ts
PaginatedResult<Blog>
```

---

## `getBlogBySlug(slug)`

Fetch a single blog including its full content.

```ts
await client.getBlogBySlug("my-blog");
```

Returns:

```ts
Blog | null
```

---

# Types

```ts
interface PaginationOptions {
  page?: number;
  limit?: number;
  query?: string;
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

interface Blog {
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
```

---

## Examples

### Latest 5 Blogs

```ts
const blogs = await client.getBlogs({
  limit: 5,
});
```

### Search with Pagination

```ts
const blogs = await client.getBlogs({
  query: "nodejs",
  page: 1,
  limit: 15,
});

console.log(blogs.pagination.total);
console.log(blogs.pagination.hasMore);
```

---

## Search Behavior

* Case-insensitive
* Partial matching
* Searches title, description, and slug
* Automatically trims extra whitespace

---

## Error Handling

```ts
try {
  const blogs = await client.getBlogs({
    query: "react",
  });
} catch (error) {
  console.error(error);
}
```

---

## License

MIT