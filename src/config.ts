// src/config.ts

const buildConfig = () => {
  // A URL da sua API Strapi, vinda do arquivo .env.local
  const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!strapiApiUrl) {
    throw new Error("A variável NEXT_PUBLIC_STRAPI_API_URL não foi definida no seu arquivo .env.local");
  }

  // Mantemos as outras configurações que o template já usa
  const name = process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME || "Seu Blog";
  const copyright = process.env.NEXT_PUBLIC_BLOG_COPYRIGHT || "Seu Nome";
  const defaultTitle =
    process.env.NEXT_DEFAULT_METADATA_DEFAULT_TITLE || "Título do Blog";
  const defaultDescription = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || "Descrição do Blog.";

  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    blog: {
      name,
      copyright,
      metadata: {
        title: {
          absolute: defaultTitle,
          default: defaultTitle,
          template: `%s - ${defaultTitle}`,
        },
        description: defaultDescription,
      },
    },
    strapi: {
      url: strapiApiUrl,
    },
    // Mantemos o segredo para a geração de imagens, pois é um recurso útil
    ogImageSecret:
      process.env.OG_IMAGE_SECRET ||
      "secret_utilizado_para_proteger_a_geracao_de_imagens",
  };
};

export const config = buildConfig();