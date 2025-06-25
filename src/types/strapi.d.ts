// src/types/strapi.d.ts

interface StrapiMediaAttributes {
  url: string;
  alternativeText?: string;
}
interface StrapiMedia {
  data: { id: number; attributes: StrapiMediaAttributes } | null;
}

// CORREÇÃO: Revertendo para a estrutura com 'attributes'
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

// CORREÇÃO: O post principal também é ajustado para esperar relações com 'attributes'
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