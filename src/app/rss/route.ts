// src/app/rss/route.ts
export const revalidate = 3600;
import { NextResponse } from "next/server";
import RSS from "rss";
import urlJoin from "url-join";
import { getPosts } from "@/lib/strapi";
import { StrapiPost } from "@/types/strapi";
import { config } from "@/config";

const baseUrl = config.baseUrl;

export async function GET() {
  const result = await getPosts({ limit: 20 });
  const posts: StrapiPost[] = result.data;
  const feed = new RSS({
    title: config.blog.name, description: config.blog.metadata.description,
    site_url: baseUrl, feed_url: urlJoin(baseUrl, "/rss"), pubDate: new Date(),
  });
  if (posts) {
    posts.forEach((post) => {
      feed.item({
        title: post.attributes.Title,
        description: post.attributes.Description || "",
        url: urlJoin(baseUrl, `/blog/${post.attributes.Slug}`),
        date: new Date(post.attributes.publishedAt || post.attributes.createdAt),
      });
    });
  }
  const xml: string = feed.xml({ indent: true });
  return new NextResponse(xml, { headers: { "Content-Type": "application/rss+xml" } });
}