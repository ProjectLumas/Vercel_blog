// src/app/rss/route.ts

export const revalidate = 3600; // Revalida a cada hora

import { NextResponse } from "next/server";
import RSS from "rss";
import urlJoin from "url-join";
import { getPosts } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import { config } from "@/config";

const baseUrl = config.baseUrl;

export async function GET() {
  try {
    const result = await getPosts({ limit: 20 });
    const posts: StrapiPost[] = result.data;

    const feed = new RSS({
      title: config.blog.name,
      description: config.blog.metadata.description,
      site_url: baseUrl,
      feed_url: urlJoin(baseUrl, "/rss"),
      pubDate: new Date(),
    });

    if (posts) {
      // CORREÇÃO: Usando 'post.attributes' para acessar os dados de cada post
      posts.forEach((post) => {
        if (post.attributes) { // Verificação de segurança
          feed.item({
            title: post.attributes.Title,
            description: post.attributes.Description || "",
            url: urlJoin(baseUrl, `/blog/${post.attributes.Slug}`),
            date: new Date(post.attributes.publishedAt || post.attributes.createdAt),
          });
        }
      });
    }

    const xml: string = feed.xml({ indent: true });

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    console.error("Erro ao gerar o feed RSS:", error);
    // Retorna uma resposta de erro 500 se algo der errado
    return new NextResponse("Não foi possível gerar o feed RSS.", { status: 500 });
  }
}