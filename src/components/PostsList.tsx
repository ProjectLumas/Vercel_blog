import { getPosts } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import { BlogPostsPreview } from "./BlogPostPreview"; // Vamos usar o componente original agora
import { BlogPostsPagination } from "./BlogPostsPagination";

export async function PostsList({ currentPage }: { currentPage: number }) {
  try {
    const result = await getPosts({ limit: 6, page: currentPage });
    const posts: StrapiPost[] = result.data; // Os dados chegam aqui
    const pagination = result.meta.pagination;

    if (!posts || posts.length === 0) {
      return <p className="text-center my-16">Nenhum post encontrado pela API.</p>;
    }

    // Agora, passamos os dados corretos para o componente de preview.
    return (
      <>
        <BlogPostsPreview posts={posts} />
        <BlogPostsPagination pagination={pagination} />
      </>
    );

  } catch (error: any) {
    console.error("[PostsList] Falha na busca de dados: ", error);
    return <p className="text-center my-16 text-red-500">Ocorreu um erro ao conectar com a API: {error.message}</p>;
  }
}