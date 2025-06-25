// src/app/blog/sitemap.tsx

import { config } from "@/config";
import { getPosts } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await getPosts({ limit: 1000 });
  const posts: StrapiPost[] = result.data;

  // Se não houver posts, retorna um array vazio para não quebrar o sitemap.
  if (!posts) return [];

  return [
    {
      url: urlJoin(config.baseUrl, "blog"),
      lastModified: new Date(),
      priority: 0.8,
    },
    // CORREÇÃO: Usando 'post.attributes.Slug' e 'post.attributes.updatedAt'
    ...posts.map((post) => {
      return {
        url: urlJoin(config.baseUrl, "blog", post.attributes.Slug),
        lastModified: new Date(post.attributes.updatedAt),
        priority: 0.8,
      };
    }),
  ];
}