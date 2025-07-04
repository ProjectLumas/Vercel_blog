// src/lib/strapi.ts
import { config } from "@/config";
import { CleanComment, CleanPost, CleanTag } from "@/types/strapi";

function getStrapiURL(path = "") { return `${config.strapi.url}${path.startsWith('/') ? '' : '/'}${path}`; }

async function fetchApi(path: string, options = {}) {
  const defaultOptions = { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' as RequestCache };
  const mergedOptions = { ...defaultOptions, ...options };
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl, mergedOptions);
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("API Error Response:", errorBody);
    throw new Error(`API call failed with status ${response.status}`);
  }
  return response.json();
}

export async function getPosts(params: { page?: number; limit?: number; tags?: string[] } = {}) {
  const query = new URLSearchParams({
    "sort[0]": "publishedAt:desc", "pagination[page]": String(params.page || 1),
    "pagination[pageSize]": String(params.limit || 6), "populate": "*",
  });
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => query.append(`filters[tags][Slug][$in]`, tag));
  }
  return fetchApi(`/api/lumas-blogs?${query.toString()}`);
}
export async function getPostBySlug(slug: string): Promise<CleanPost | null> {
  const query = new URLSearchParams({ "filters[Slug][$eq]": slug, "populate": "*" });
  const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return res.data?.[0] ?? null;
}
export async function getTags(): Promise<CleanTag[]> {
  const res = await fetchApi(`/api/tags`);
  return res.data;
}
export async function getTagBySlug(slug: string): Promise<CleanTag | null> {
  const query = new URLSearchParams({ "filters[Slug][$eq]": slug });
  const res = await fetchApi(`/api/tags?${query.toString()}`);
  return res.data?.[0] ?? null;
}
export async function getComments(slug: string): Promise<CleanComment[]> {
    const query = new URLSearchParams({ "filters[post][Slug][$eq]": slug, "sort[0]": "createdAt:asc" });
    const res = await fetchApi(`/api/comments?${query.toString()}`);
    return res.data;
}
export async function getRelatedPosts(postId: number, tagSlug: string): Promise<CleanPost[]> {
  const query = new URLSearchParams({
    "filters[tags][Slug][$eq]": tagSlug, "filters[id][$ne]": postId.toString(),
    "pagination[limit]": "3", "populate": "*",
  });
  const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return res.data;
}
export async function createComment(data: { author: string; email: string; content: string; postSlug: string; }) {
  const postRes = await fetchApi(`/api/lumas-blogs?filters[Slug][$eq]=${data.postSlug}&fields[0]=id`);
  const post = postRes.data?.[0];
  if (!post) throw new Error("Post não encontrado");
  return fetchApi('/api/comments', { method: 'POST', body: JSON.stringify({ data: { author: data.author, email: data.email, content: data.content, post: post.id } }) });
}
export function getStrapiMedia(media: any): string | null {
  if (Array.isArray(media) && media.length > 0 && media[0].url) {
    const { url } = media[0];
    return url.startsWith("/") ? getStrapiURL(url) : url;
  }
  return null;
}