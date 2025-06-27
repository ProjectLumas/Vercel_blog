// src/types/strapi.d.ts

// A estrutura ideal e simples para uma imagem.
interface CleanMedia {
  url: string;
  alternativeText?: string | null;
}
// A estrutura ideal e simples para uma tag e um autor.
export interface CleanTag {
  id: number;
  Name: string;
  Slug: string;
}
export interface CleanAuthor {
  id: number;
  Name: string;
  picture: CleanMedia | null;
}
// O tipo do Post, 100% plano e fácil de usar.
export interface CleanPost {
  id: number;
  Title: string;
  Description: string | null;
  Content: any;
  Slug: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Media: CleanMedia | null;
  author: CleanAuthor | null;
  tags: CleanTag[];
}
export interface StrapiComment {
  id: number;
  attributes: { author: string; content: string; createdAt: string; };
}