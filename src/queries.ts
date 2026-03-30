import { gql } from "@apollo/client";

export const SEARCH_BLOGS = gql`
query SearchBlogs($query: String, $skip: Int!, $take: Int!) {
  blogs(
    where: { title: { contains: $query } }
    orderBy: { createdAt: desc }
    skip: $skip
    take: $take
  ) {
    id
    title
    slug
    descroption
    readTime
    publishedAt
  }
  blogsConnection(where: { title: { contains: $query } }) {
    aggregate {
      count
    }
  }
}
`;

export const GET_BLOGS = gql`
query GetBlogs {
  blogs(orderBy: { createdAt: desc }) {
    id
    title
    slug
    descroption
    readTime
    publishedAt
  }
}
`;

export const GET_BLOG_BY_SLUG = gql`
query GetBlog($slug: String!) {
  blogs(where: { slug: { equals: $slug } }) {
    id
    title
    slug
    descroption
    content
    readTime
    publishedAt
  }
}
`;