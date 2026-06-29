export const SEARCH_BLOGS = `
query SearchBlogs($query: String, $skip: Int!, $take: Int!) {
  blogs(
    where: {
      OR: [
        { title: { contains: $query, mode: insensitive } }
        { description: { contains: $query, mode: insensitive } }
        { slug: { contains: $query, mode: insensitive } }
      ]
    }
    orderBy: { createdAt: desc }
    skip: $skip
    take: $take
  ) {
    id
    title
    slug
    image {
      url
    }
    description
    readTime
    publishedAt
    author {
      name
    }
    categories {
      name
    }
    tags {
      name
    }
  }
  blogsCount(
    where: {
      OR: [
        { title: { contains: $query, mode: insensitive } }
        { description: { contains: $query, mode: insensitive } }
        { slug: { contains: $query, mode: insensitive } }
      ]
    }
  )
}
`;

export const GET_BLOGS = `
query GetBlogs {
  blogs(orderBy: { createdAt: desc }) {
    id
    title
    slug
    image {
      url
    }
    description
    readTime
    publishedAt
    author {
      name
    }
    categories {
      name
    }
    tags {
      name
    }
  }
}
`;

export const GET_BLOG_BY_SLUG = `
query GetBlog($slug: String!) {
  blogs(where: { slug: { equals: $slug } }) {
    id
    title
    slug
    image {
      url
    }
    description
    content
    readTime
    publishedAt
    author {
      name
    }
    categories {
      name
    }
    tags {
      name
    }
  }
}
`;