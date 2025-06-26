// src/app/blog/sitemap.tsx
import { config } from "@/config";
import { getPosts } from "@/lib/strapi";
import { CleanPost } from "@/types/strapi";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await getPosts({ limit: 1000 });
  const posts: CleanPost[] = result.data;
  if (!posts) return [];
  return [
    { url: urlJoin(config.baseUrl, "blog"), lastModified: new Date(), priority: 0.8 },
    ...posts.map((post) => ({
        url: urlJoin(config.baseUrl, "blog", post.Slug || ""),
        lastModified: new Date(post.updatedAt),
        priority: 0.8,
      })),
  ];
}