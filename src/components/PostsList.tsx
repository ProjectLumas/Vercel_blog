// src/components/PostsList.tsx
import { getPosts } from "@/lib/strapi";
import { CleanPost } from "@/types/strapi"; // CORREÇÃO
import { BlogPostsPreview } from "./BlogPostPreview";
import { BlogPostsPagination } from "./BlogPostsPagination";

export async function PostsList({ currentPage }: { currentPage: number }) {
  const result = await getPosts({ limit: 6, page: currentPage });
  const posts: CleanPost[] = result.data; // CORREÇÃO
  const pagination = result.meta.pagination;
  if (posts.length === 0) {
    return <p className="text-center my-16">Nenhum post encontrado.</p>;
  }
  return (<><BlogPostsPreview posts={posts} /><BlogPostsPagination pagination={pagination} /></>);
}