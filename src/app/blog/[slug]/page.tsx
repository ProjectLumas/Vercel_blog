// src/app/blog/[slug]/page.tsx
import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getPostBySlug, getRelatedPosts } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Post não encontrado" };
  const { Title, Description, Media } = post;
  const imageUrl = Media?.[0]?.url;
  return { title: Title, description: Description || undefined, openGraph: { title: Title, description: Description || "", images: imageUrl ? [imageUrl] : [], }, };
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { Title, publishedAt, updatedAt, Media, author, tags } = post;
  const firstTagSlug = tags?.[0]?.Slug;
  const relatedPosts = firstTagSlug ? await getRelatedPosts(post.id, firstTagSlug) : [];
  const authorName = author?.Name;
  const postImage = Media?.[0]?.url;

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