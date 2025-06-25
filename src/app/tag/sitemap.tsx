// src/app/tag/sitemap.tsx

import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { config } from "@/config";
import { getTags } from "@/lib/strapi";
import { StrapiTag } from "@/types/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tags: StrapiTag[] = await getTags();

  return [
    {
      url: urlJoin(config.baseUrl, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...tags.map((tag) => {
      return {
        url: urlJoin(config.baseUrl, "tag", tag.attributes.Slug),
        lastModified: new Date(),
        priority: 0.8,
      };
    }),
  ];
}