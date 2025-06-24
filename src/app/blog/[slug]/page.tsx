// src/app/blog/[slug]/page.tsx

import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import { getPostBySlug, getRelatedPosts, getStrapiMedia } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

export async function generateMetadata(props: { params: { slug: string } }) {
  const { slug } = props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  const { title, description } = post.attributes;
  const postImage = getStrapiMedia(post.attributes.image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: postImage ? [postImage] : [],
    },
  };
}

interface Params {
  slug: string;
}

const Page = async (props: { params: Params }) => {
  const { slug } = props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const { title, publishedAt, updatedAt, image, author } = post.attributes;

  // Lógica para buscar posts relacionados: Pega a primeira tag do post e busca outros com a mesma tag.
  const firstTagSlug = post.attributes.tags?.data[0]?.attributes.slug;
  const relatedPosts = firstTagSlug ? await getRelatedPosts(post.id, firstTagSlug) : [];
  
  const authorName = author?.data?.attributes?.name;
  const authorImage = getStrapiMedia(author?.data?.attributes?.picture);
  const postImage = getStrapiMedia(image);

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
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