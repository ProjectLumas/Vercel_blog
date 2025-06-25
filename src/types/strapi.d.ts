

interface StrapiMediaAttributes {
  url: string;
  alternativeText?: string;
}
interface StrapiMedia {
  data: { id: number; attributes: StrapiMediaAttributes } | null;
}

export interface StrapiTag {
  id: number;
  attributes: {
    Name: string;
    Slug: string;
  };
}

export interface StrapiAuthor {
  id: number;
  attributes: {
    Name: string;
    picture: StrapiMedia;
  };
}

// CORREÇÃO: Restauramos a camada 'attributes' para o post,
// que é a estrutura correta retornada pela API do Strapi.
export interface StrapiPost {
  id: number;
  attributes: {
    Title: string;
    Description: string | null;
    Content: any;
    Slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Media: StrapiMedia | null;
    author: { data: StrapiAuthor | null };
    tags: { data: StrapiTag[] };
  };
}

export interface StrapiComment {
  id: number;
  attributes: {
    author: string;
    content: string;
    createdAt: string;
  };
}
