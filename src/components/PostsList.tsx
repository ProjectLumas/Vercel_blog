// src/components/PostsList.tsx

import { getPosts } from "@/lib/strapi";
import { CleanPost } from "@/types/strapi";
import { BlogPostsPreview } from "./BlogPostPreview";
import { BlogPostsPagination } from "./BlogPostsPagination";

export async function PostsList({ currentPage }: { currentPage: number }) {
  try {
    const result = await getPosts({ page: currentPage });
    const posts: CleanPost[] = result.data;
    const pagination = result.meta.pagination;

    if (posts.length === 0) {
      return <p className="text-center my-16">Nenhum post publicado ainda.</p>;
    }

    return (
      <>
        <BlogPostsPreview posts={posts} />
        <BlogPostsPagination pagination={pagination} />
      </>
    );
  } catch (error: any) {
    console.error("[PostsList] Falha na busca de dados: ", error);
    return <p className="text-center my-16 text-destructive">Ocorreu um erro ao carregar os posts.</p>;
  }
}