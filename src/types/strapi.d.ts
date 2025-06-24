interface StrapiMediaAttributes {
  url: string;
}
interface StrapiMedia {
  data: { attributes: StrapiMediaAttributes } | null;
}
export interface StrapiTag {
  id: number;
  Name: string;
  Slug: string;
}
export interface StrapiAuthor {
  id: number;
  Name: string;
  picture: StrapiMedia;
}

// ALTERAÇÃO CRUCIAL:
// Removemos a camada "attributes" e colocamos as propriedades diretamente.
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
  author: StrapiAuthor | null;
  tags: StrapiTag[];
}

export interface StrapiComment {
  id: number;
  attributes: {
    author: string;
    content: string;
    createdAt: string;
  };
}
// --- Fim do Código Corrigido ---