// src/lib/strapi.ts

import { config } from "@/config";
import { StrapiComment, StrapiPost } from "@/types/strapi";

// Função auxiliar para construir a URL completa para a API do Strapi
function getStrapiURL(path = "") {
  // Garante que não haja barras duplicadas
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
    // --- LINHA ADICIONADA AQUI ---
    // Esta opção diz ao Next.js para NÃO guardar a resposta em cache.
    cache: 'no-store', 
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

  const postsRes = await fetchApi(`api/lumas-blogs?${query.toString()}`);
  return postsRes;
}

// Função para buscar um post específico pelo slug
export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const query = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "populate": "*",
  });

  const postsRes = await fetchApi(`api/lumas-blogs?${query.toString()}`);
  
  if (postsRes?.data?.length) {
    return postsRes.data[0];
  }
  return null;
}

// Função para buscar comentários de um post específico
export async function getComments(postSlug: string): Promise<StrapiComment[]> {
  const query = new URLSearchParams({
    "filters[post][slug][$eq]": postSlug,
    "sort[0]": "createdAt:asc",
  });
  const commentsRes = await fetchApi(`api/comments?${query.toString()}`);
  return commentsRes.data;
}

// Função para criar um novo comentário
export async function createComment(data: {
  author: string;
  email: string;
  content: string;
  postSlug: string;
}) {
  const post = await getPostBySlug(data.postSlug);
  if (!post) {
    throw new Error("Post não encontrado para associar o comentário.");
  }

  const response = await fetchApi('api/comments', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        author: data.author,
        email: data.email,
        content: data.content,
        post: post.id,
      },
    }),
  });
  return response;
}

// Função para extrair a URL de uma imagem de forma segura
export function getStrapiMedia(media: any): string | null {
  if (!media?.data?.attributes?.url) {
    return null;
  }
  const { url } = media.data.attributes;
  return url.startsWith("/") ? getStrapiURL(url) : url;
}

// Função de posts relacionados

export async function getRelatedPosts(postId: number, tagSlug: string): Promise<StrapiPost[]> {
  const query = new URLSearchParams({
    // Filtra por posts que têm a mesma tag
    "filters[tags][slug][$eq]": tagSlug,
    // Filtra para EXCLUIR o post atual da lista de relacionados
    "filters[id][$ne]": postId.toString(),
    "pagination[limit]": "3", // Pega no máximo 3 posts
    "populate": "*",
  });

  const postsRes = await fetchApi(`/api/lumas-blogs?${query.toString()}`);
  return postsRes.data;
}