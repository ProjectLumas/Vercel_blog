// src/lib/strapi.ts

import { config } from "@/config";
import { StrapiComment, CleanPost, CleanTag, CleanAuthor } from "@/types/strapi";

function getStrapiURL(path = "") { return `${config.strapi.url}${path.startsWith('/') ? '' : '/'}${path}`; }

async function fetchApi(path: string, options = {}) {
  const defaultOptions = { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' as RequestCache };
  const mergedOptions = { ...defaultOptions, ...options };
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl, mergedOptions);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Falha na requisição da API');
  }
  return response.json();
}

function normalizePost(postData: any): CleanPost {
  const { id, attributes } = postData;
  const getMediaObject = (mediaData: any) => {
    if (!mediaData?.data?.attributes) return null;
    return {
      url: getStrapiURL(mediaData.data.attributes.url),
      alternativeText: mediaData.data.attributes.alternativeText,
    };
  };
  const authorData = attributes.author?.data?.attributes;
  const authorId = attributes.author?.data?.id;
  const tagsData = attributes.tags?.data;
  return {
    id, Title: attributes.Title, Description: attributes.Description,
    Content: attributes.Content, Slug: attributes.Slug, createdAt: attributes.createdAt,
    updatedAt: attributes.updatedAt, publishedAt: attributes.publishedAt,
    Media: getMediaObject(attributes.Media),
    author: authorData ? { id: authorId, Name: authorData.Name, picture: getMediaObject(authorData.picture) } : null,
    tags: tagsData ? tagsData.map((tag: any) => ({ id: tag.id, ...tag.attributes })) : [],
  };
}

export async function getPosts(params: { page?: number; limit?: number; tags?: string[] } = {}) {
  const { page = 1, limit = 6, tags = [] } = params;
  const query = new URLSearchParams({
    "sort[0]": "publishedAt:desc", "pagination[page]": page.toString(),
    "pagination[pageSize]": limit.toString(), 
    "populate": "*", // CORREÇÃO: Usando o wildcard '*' em vez de 'deep'
  });
  if (tags.length > 0) tags.forEach((tag) => query.append(`filters[tags][Slug][$in]`, tag));
  const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return { data: res.data.map(normalizePost), meta: res.meta, };
}

export async function getPostBySlug(slug: string): Promise<CleanPost | null> {
  const query = new URLSearchParams({ "filters[Slug][$eq]": slug, "populate": "*" }); // CORREÇÃO
  const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  if (!res.data || res.data.length === 0) return null;
  return normalizePost(res.data[0]);
}

export async function getTags(): Promise<CleanTag[]> {
  const res = await fetchApi(`/api/tags?populate=*`);
  return res.data.map((tag: any) => ({ id: tag.id, ...tag.attributes }));
}

export async function getTagBySlug(slug: string): Promise<CleanTag | null> {
  const query = new URLSearchParams({ "filters[Slug][$eq]": slug });
  const res = await fetchApi(`/api/tags?${query.toString()}`);
  if (!res.data || res.data.length === 0) return null;
  const { id, attributes } = res.data[0];
  return { id, ...attributes };
}

export async function getRelatedPosts(postId: number, tagSlug: string): Promise<CleanPost[]> {
  const query = new URLSearchParams({
    "filters[tags][Slug][$eq]": tagSlug, "filters[id][$ne]": postId.toString(),
    "pagination[limit]": "3", "populate": "*", // CORREÇÃO
  });
  const res = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return res.data.map(normalizePost);
}

export async function getComments(slug: string): Promise<StrapiComment[]> {
    const query = new URLSearchParams({ "filters[post][Slug][$eq]": slug, "sort[0]": "createdAt:asc" });
    const res = await fetchApi(`/api/comments?${query.toString()}`);
    return res.data;
}

export async function createComment(data: { author: string; email: string; content: string; postSlug: string; }) {
  const postRes = await fetchApi(`/api/lumas-blogs?filters[Slug][$eq]=${data.postSlug}&fields[0]=id`);
  const post = postRes.data?.[0];
  if (!post) throw new Error("Post não encontrado");
  return fetchApi('/api/comments', { method: 'POST', body: JSON.stringify({ data: { author: data.author, email: data.email, content: data.content, post: post.id } }) });
}