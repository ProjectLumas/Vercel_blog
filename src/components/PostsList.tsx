// src/components/PostsList.tsx

import { getPosts } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import { BlogPostsPreview } from "./BlogPostPreview";
import { BlogPostsPagination } from "./BlogPostsPagination";

export async function PostsList({ currentPage }: { currentPage: number }) {
  const result = await getPosts({ limit: 6, page: currentPage });
  
  // CORREÇÃO: Normalizamos os dados para a estrutura "plana"
  const posts: StrapiPost[] = result.data.map((post: any) => ({ id: post.id, ...post.attributes }));
  const pagination = result.meta.pagination;

  if (posts.length === 0) {
    return <p className="text-center my-16">Nenhum post encontrado.</p>;
  }

  return (
    <>
      <BlogPostsPreview posts={posts} />
      <BlogPostsPagination pagination={pagination} />
    </>
  );
}