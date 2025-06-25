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

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug);

  if (!tag) {
    return { title: "Tag não encontrada" };
  }
  
  // AGORA FUNCIONA: O 'tag' tem 'attributes'
  const tagName = tag.attributes.Name;
  return {
    title: `#${tagName}`,
    description: `Posts com a tag #${tagName}`,
  };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return notFound();
  }

  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
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
      <BlogPostsPagination
        pagination={pagination}
        basePath={`/tag/${slug}/?page=`}
      />
      <Footer />
    </div>
  );
};

export default Page;