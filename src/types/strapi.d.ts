// src/types/strapi.d.ts

interface CleanMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  name: string;
}
export interface CleanTag {
  id: number;
  Name: string;
  Slug: string;
}
export interface CleanAuthor {
  id: number;
  Name: string;
}
export interface CleanPost {
  id: number;
  Title: string;
  Description: string | null;
  Content: any;
  Slug: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Media: CleanMedia[] | null;
  author: CleanAuthor | null;
  tags: CleanTag[];
}
export interface CleanComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}