// src/app/tag/[slug]/page.tsx

import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { getPosts, getTagBySlug } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// CORREÇÃO: Tipagem correta para Next.js 15, onde params e searchParams são Promises
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tag = await getTagBySlug(resolvedParams.slug);
  const tagName = tag?.attributes.Name || resolvedParams.slug;
  return { title: `#${tagName}`, description: `Posts com a tag #${tagName}` };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { slug } = resolvedParams;
  const tag = await getTagBySlug(slug);
  if (!tag) return notFound();

  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string, 10) : 1;
  const result = await getPosts({ limit: 6, tags: [slug], page });
  
  const posts: StrapiPost[] = result.data;
  const pagination = result.meta.pagination;

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header />
      <Link href="/tag">
        <Badge className="px-2 py-1">
          <CircleX className="inline-block w-4 h-4 mr-2" />
          Posts com a tag <strong className="mx-2">#{tag.attributes.Name}</strong>
        </Badge>
      </Link>
      <BlogPostsPreview posts={posts} />
      <BlogPostsPagination pagination={pagination} basePath={`/tag/${slug}/?page=`} />
    </div>
  );
};

export default Page;