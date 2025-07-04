// src/components/RelatedPosts.tsx
"use client";
import { CleanPost } from "@/types/strapi";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import { getStrapiMedia } from "@/lib/strapi";

export const RelatedPosts: FunctionComponent<{ posts: CleanPost[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="my-8">
      <div className="mb-6 text-lg font-semibold tracking-tight">Posts Relacionados</div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => {
          const imageUrl = getStrapiMedia(post.Media);
          return (
            <div className=" bg-muted overflow-hidden rounded-lg" key={post.id}>
              <Link href={`/blog/${post.Slug}`}><AspectRatio ratio={16 / 9} className="w-full"><Image src={imageUrl || "/images/placeholder.png"} alt={post.Title} fill className="h-full min-h-full min-w-full object-cover object-center" /></AspectRatio></Link>
              <div className="prose prose-sm dark:prose-invert p-4">
                <h3 className="line-clamp-2">{post.Title}</h3>
                <p className="line-clamp-3">{post.Description}</p>
                <Link href={`/blog/${post.Slug}`}><strong>Leia a História Completa</strong></Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};