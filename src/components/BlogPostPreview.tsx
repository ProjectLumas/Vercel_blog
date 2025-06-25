
"use client";
import { cn } from "@/lib/utils";
import { getStrapiMedia } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import { formatDate } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

const BlogPostPreviewItem: FunctionComponent<{ post: StrapiPost }> = ({ post }) => {
  // Agora usamos .attributes para acessar os dados, conforme definido em nossos tipos.
  if (!post?.attributes) return null;

  const { Title, Slug, Description, publishedAt, updatedAt, Media, tags } = post.attributes;
  const imageUrl = getStrapiMedia(Media);

  return (
    <div className="break-words">
      <Link href={`/blog/${Slug}`}>
        <div className="aspect-[16/9] relative">
          <Image alt={Title || 'Imagem do post'} className="object-cover" src={imageUrl || "/images/placeholder.webp"} fill />
        </div>
      </Link>
      <div className="grid grid-cols-1 gap-3 md:col-span-2 mt-4">
        <h2 className="font-sans font-semibold tracking-tighter text-primary text-2xl md:text-3xl">
          <Link href={`/blog/${Slug}`}>{Title}</Link>
        </h2>
        <div className="prose lg:prose-lg italic tracking-tighter text-muted-foreground">
          {formatDate(new Date(publishedAt || updatedAt), "dd MMMM yyyy")}
        </div>
        <div className="prose lg:prose-lg leading-relaxed md:text-lg line-clamp-4 text-muted-foreground">
          {Description}
        </div>
        <div className="text-sm text-muted-foreground">
          {tags?.data.map((tag) => (
            <div key={tag.id} className="mr-2 inline-block">
              <Link href={`/tag/${tag.attributes.Slug}`}>#{tag.attributes.Name}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogPostsPreview: FunctionComponent<{ posts: StrapiPost[]; className?: string; }> = ({ posts, className }) => {
  if (!Array.isArray(posts)) return <p>Erro: posts não é um array.</p>;
  return (<div className={cn("grid grid-cols-1 gap-16 lg:gap-28 md:grid-cols-2 md:my-16 my-8", className)}>{posts.map((post) => (<BlogPostPreviewItem key={post?.id} post={post} />))}</div>);
};