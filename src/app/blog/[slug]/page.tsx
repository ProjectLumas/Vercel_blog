// src/app/blog/[slug]/page.tsx

import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getPostBySlug, getPosts, getRelatedPosts, getStrapiMedia } from "@/lib/strapi";
import { CleanPost } from "@/types/strapi";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";
import { use } from "react"; // Importando o hook 'use' do React

// Esta função diz ao Next.js para gerar as páginas de post no momento do build.
export async function generateStaticParams() {
  try {
    const result = await getPosts({ limit: 100 });
    const posts: CleanPost[] = result.data;

    return posts
      .filter(post => post.Slug) // Garante que posts sem slug não quebrem o build
      .map((post) => ({
        slug: post.Slug!,
      }));
  } catch (error) {
    console.error("Falha ao gerar parâmetros estáticos:", error);
    return [];
  }
}

// CORREÇÃO: A 'prop' params é definida estritamente como uma Promise, como a Vercel exige.
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  // Usamos 'await' para resolver a Promise.
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Post não encontrado" };
  
  const { Title, Description, Media } = post;
  const imageUrl = getStrapiMedia(Media);

  return { 
    title: Title, 
    description: Description || undefined, 
    openGraph: { title: Title, description: Description || "", images: imageUrl ? [imageUrl] : [], } 
  };
}

const Page = ({ params }: PageProps) => {
  // CORREÇÃO: Usamos o hook 'use' para "desembrulhar" a Promise de forma síncrona dentro do componente.
  // Esta é a maneira moderna e correta de lidar com Promises em Server Components sem 'async/await' direto.
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  // Como a busca de dados é assíncrona, criamos um subcomponente para ela.
  // Isso isola a lógica assíncrona e mantém o componente 'Page' principal síncrono.
  return <PostPageContent slug={slug} />;
};

// Subcomponente assíncrono para buscar e renderizar os dados
async function PostPageContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { Title, publishedAt, updatedAt, Media, author, tags } = post;
  const firstTagSlug = tags?.[0]?.Slug;
  const relatedPosts = firstTagSlug ? await getRelatedPosts(post.id, firstTagSlug) : [];
  const authorName = author?.Name;
  const postImage = getStrapiMedia(Media);

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: Title,
    image: postImage || undefined, datePublished: publishedAt, dateModified: updatedAt,
    author: authorName ? { "@type": "Person", name: authorName } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-5">
        <Header />
        <div className="max-w-prose mx-auto text-xl">
          <BlogPostContent post={post} />
          <RelatedPosts posts={relatedPosts} />
          <CommentSection slug={slug} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Page;