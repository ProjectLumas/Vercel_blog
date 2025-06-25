// src/app/blog/[slug]/page.tsx

import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import { getPostBySlug, getRelatedPosts, getStrapiMedia } from "@/lib/strapi"; // Apenas funções do Strapi
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

// CORREÇÃO: A função de metadados agora usa 'getPostBySlug'
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  const { Title, Description, Media } = post;
  const imageUrl = getStrapiMedia(Media);

  return {
    title: Title,
    description: Description,
    openGraph: {
      title: Title,
      description: Description || "",
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }
  
  const { Title, publishedAt, updatedAt, Media, author, tags } = post;

  const firstTagSlug = tags?.[0]?.Slug;
  const relatedPosts = firstTagSlug ? await getRelatedPosts(post.id, firstTagSlug) : [];

  const authorName = author?.Name;
  const authorImage = getStrapiMedia(author?.picture);
  const postImage = getStrapiMedia(Media);

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: Title,
    image: postImage || undefined,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: authorName ? { "@type": "Person", name: authorName, image: authorImage || undefined } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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