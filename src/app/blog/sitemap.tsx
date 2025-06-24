// src/app/blog/sitemap.tsx

import { config } from "@/config";
import { getPosts } from "@/lib/strapi"; // 1. Importa a nova função do Strapi
import { StrapiPost } from "@/types/strapi"; // 2. Importa o tipo de Post do Strapi
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 3. Usa a nova função para buscar os dados. O 'limit' alto garante que todos os posts venham.
  const result = await getPosts({ limit: 1000 });
  const posts: StrapiPost[] = result.data;

  // 4. Mapeia os posts, acessando os atributos corretamente (post.attributes.*)
  const postEntries = posts.map((post) => {
    return {
      url: urlJoin(config.baseUrl, "blog", post.attributes.slug),
      lastModified: new Date(post.attributes.updatedAt),
      priority: 0.8,
    };
  });

  return [
    {
      url: urlJoin(config.baseUrl, "blog"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...postEntries,
  ];
}