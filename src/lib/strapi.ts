// src/lib/strapi.ts

import { config } from "@/config";
import { StrapiComment, StrapiPost } from "@/types/strapi";

function getStrapiURL(path = "") {
  if (path.startsWith('/')) path = path.slice(1);
  return `${config.strapi.url}/${path}`;
}

async function fetchApi(path: string, options = {}) {
  const defaultOptions = { 
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store' as RequestCache 
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl, mergedOptions);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Falha na requisição da API');
  }
  return response.json();
}

export async function getPosts(params: { page?: number; limit?: number; tags?: string[] } = {}) {
  const { page = 1, limit = 6, tags = [] } = params;
  const query = new URLSearchParams({
    "sort[0]": "publishedAt:desc",
    "pagination[page]": page.toString(),
    "pagination[pageSize]": limit.toString(),
    "populate": "*",
  });
  if (tags.length > 0) {
    tags.forEach((tag, i) => query.append(`filters[tags][Slug][$in][${i}]`, tag));
  }
  return fetchApi(`/api/lumas-blogs?${query.toString()}`);
}

export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const query = new URLSearchParams({ "filters[Slug][$eq]": slug, "populate": "*" });
  const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return res.data?.[0] ?? null;
}

export async function getTagBySlug(slug: string) {
  const query = new URLSearchParams({ "filters[Slug][$eq]": slug });
  const res = await fetchApi(`/api/tags?${query.toString()}`);
  return res.data?.[0] ?? null;
}

// --- FUNÇÕES ADICIONADAS ---
export async function getComments(slug: string): Promise<StrapiComment[]> {
    const query = new URLSearchParams({ 
        "filters[post][Slug][$eq]": slug,
        "sort[0]": "createdAt:asc",
        "populate": "*",
    });
    const res = await fetchApi(`/api/comments?${query.toString()}`);
    return res.data;
}

export async function getRelatedPosts(postId: number, tagSlug: string): Promise<StrapiPost[]> {
    const query = new URLSearchParams({
        "filters[tags][Slug][$eq]": tagSlug,
        "filters[id][$ne]": postId.toString(),
        "pagination[limit]": "3",
        "populate": "*",
    });
    const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
    return res.data;
}
// --- FIM DAS FUNÇÕES ADICIONADAS ---

export async function createComment(data: { author: string; email: string; content: string; postSlug: string; }) {
  const post = await getPostBySlug(data.postSlug);
  if (!post) throw new Error("Post não encontrado");
  return fetchApi('/api/comments', {
    method: 'POST',
    body: JSON.stringify({ data: { author: data.author, email: data.email, content: data.content, post: post.id } }),
  });
}

export function getStrapiMedia(media: any): string | null {
  if (!media?.data?.attributes?.url) return null;
  const { url } = media.data.attributes;
  return url.startsWith("/") ? getStrapiURL(url) : url;
}