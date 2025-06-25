// src/app/blog/sitemap.tsx

import { config } from "@/config";
import { getPosts } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await getPosts({ limit: 1000 }); // Busca um número grande de posts
  const posts: StrapiPost[] = result.data;

  return [
    {
      url: urlJoin(config.baseUrl, "blog"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...posts.map((post) => {
      return {
        url: urlJoin(config.baseUrl, "blog", post.attributes.Slug),
        lastModified: new Date(post.attributes.updatedAt),
        priority: 0.8,
      };
    }),
  ];
}