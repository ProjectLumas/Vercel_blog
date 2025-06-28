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

export async function generateStaticParams() {
  const result = await getPosts({ limit: 100 });
  const posts: CleanPost[] = result.data;

  return posts
    .filter(post => post.Slug)
    .map((post) => ({
      slug: post.Slug!,
    }));
}

// CORREÇÃO: A prop 'params' agora é um objeto simples, não mais uma Promise.
interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  // CORREÇÃO: Acessamos 'params.slug' diretamente, sem 'await'.
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post não encontrado" };
  
  const { Title, Description, Media } = post;
  const imageUrl = getStrapiMedia(Media);

  return { 
    title: Title, 
    description: Description || undefined, 
    openGraph: { title: Title, description: Description || "", images: imageUrl ? [imageUrl] : [], } 
  };
}

const Page = async ({ params }: PageProps) => {
  // CORREÇÃO: Acessamos 'params.slug' diretamente, sem 'await'.
  const { slug } = params;
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
};

export default Page;