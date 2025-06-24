// src/app/rss/route.ts

export const revalidate = 3600; // 1 hora

import { NextResponse } from "next/server";
import RSS from "rss";
import urlJoin from "url-join";
import { getPosts } from "@/lib/strapi"; // 1. Importa a função do Strapi
import { StrapiPost } from "@/types/strapi"; // 2. Importa o tipo do Strapi
import { config } from "@/config";

const baseUrl = config.baseUrl;

export async function GET() {
  // 3. Busca os 20 posts mais recentes do Strapi
  const result = await getPosts({ limit: 20 });
  const posts: StrapiPost[] = result.data;

  const feed = new RSS({
    title: config.blog.name,
    description: config.blog.metadata.description,
    site_url: baseUrl,
    feed_url: urlJoin(baseUrl, "/rss"),
    pubDate: new Date(),
  });

  // 4. Itera sobre os posts e ajusta o acesso aos dados para usar 'attributes'
  posts.forEach((post) => {
    feed.item({
      title: post.attributes.title,
      description: post.attributes.description || "",
      url: urlJoin(baseUrl, `/blog/${post.attributes.slug}`),
      date: post.attributes.publishedAt || post.attributes.createdAt,
    });
  });

  const xml: string = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
    },
  });
}