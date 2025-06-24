// src/app/tag/sitemap.tsx

import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { config } from "@/config";
import { getTags } from "@/lib/strapi"; // 1. Importa a nova função de tags
import { StrapiTag } from "@/types/strapi"; // 2. Importa o tipo de Tag

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 3. Usa a nova função getTags
  const tags: StrapiTag[] = await getTags();

  // 4. Mapeia as tags, acessando os atributos corretamente (tag.attributes.*)
  const tagEntries = tags.map((tag) => {
    return {
      url: urlJoin(config.baseUrl, "tag", tag.attributes.slug), // Usa o slug da tag
      lastModified: new Date(),
      priority: 0.8,
    };
  });

  return [
    {
      url: urlJoin(config.baseUrl, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...tagEntries,
  ];
}