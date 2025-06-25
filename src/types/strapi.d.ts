// src/types/strapi.d.ts

// Tipos para Relações (que mantêm a estrutura 'attributes')
interface StrapiMediaAttributes {
  url: string;
  alternativeText?: string;
}
interface StrapiMedia {
  data: { id: number; attributes: StrapiMediaAttributes } | null;
}
export interface StrapiTag {
  id: number;
  attributes: { Name: string; Slug: string; };
}
export interface StrapiAuthor {
  id: number;
  attributes: { Name: string; picture: StrapiMedia; };
}

// O tipo do Post em si é "plano", mas suas relações não são.
export interface StrapiPost {
  id: number;
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
}

export interface StrapiComment {
  id: number;
  attributes: {
    author: string;
    content: string;
    createdAt: string;
  };
}