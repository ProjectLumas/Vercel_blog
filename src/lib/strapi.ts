// src/lib/strapi.ts

import { config } from "@/config";
import { StrapiComment, StrapiPost, StrapiTag } from "@/types/strapi";

// Função auxiliar para construir a URL completa para a API do Strapi
function getStrapiURL(path = "") {
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  return `${config.strapi.url}/${path}`;
}

// Função para fazer o fetch na API do Strapi de forma segura
async function fetchApi(path: string, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  const requestUrl = getStrapiURL(path);

  try {
    const response = await fetch(requestUrl, mergedOptions);
    if (!response.ok) {
      console.error(`Erro na API: ${response.status} ${response.statusText}`);
      const errorBody = await response.json();
      throw new Error(errorBody.error?.message || 'Falha na requisição da API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Função para buscar múltiplos posts
export async function getPosts(params: { page?: number; limit?: number; tags?: string[] } = {}) {
  const { page = 1, limit = 6, tags = [] } = params;
  
  const query = new URLSearchParams({
    "sort[0]": "publishedAt:desc",
    "pagination[page]": page.toString(),
    "pagination[pageSize]": limit.toString(),
    "populate": "*",
  });

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      query.append(`filters[tags][slug][$in][${i}]`, tag);
    });
  }
  
  // CORREÇÃO: Usando o nome correto do endpoint que definimos no Strapi
  const postsRes = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return postsRes;
}

// Função para buscar um post específico pelo slug
export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const query = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "populate": "*",
  });

  const postsRes = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  
  if (postsRes?.data?.length) {
    return postsRes.data[0];
  }
  return null;
}

// --- NOVAS FUNÇÕES ADICIONADAS AQUI ---

// Função para buscar TODAS as tags
export async function getTags(): Promise<StrapiTag[]> {
  const tagsRes = await fetchApi(`/api/tags`);
  return tagsRes.data;
}

// Função para buscar UMA tag específica pelo seu slug
export async function getTagBySlug(slug: string): Promise<StrapiTag | null> {
  const query = new URLSearchParams({
    "filters[slug][$eq]": slug,
  });
  const tagsRes = await fetchApi(`/api/tags?${query.toString()}`);
  if (tagsRes?.data?.length) {
    return tagsRes.data[0];
  }
  return null;
}

// --- FIM DAS NOVAS FUNÇÕES ---


// Funções de Comentários
export async function createComment(data: { author: string; email: string; content: string; postSlug: string; }) {
  const post = await getPostBySlug(data.postSlug);
  if (!post) throw new Error("Post não encontrado para associar o comentário.");
  return fetchApi('api/comments', {
    method: 'POST',
    body: JSON.stringify({ data: { author: data.author, email: data.email, content: data.content, post: post.id } }),
  });
}

// Função para extrair a URL de uma imagem de forma segura
export function getStrapiMedia(media: any): string | null {
  if (!media?.data?.attributes?.url) return null;
  const { url } = media.data.attributes;
  return url.startsWith("/") ? getStrapiURL(url) : url;
}