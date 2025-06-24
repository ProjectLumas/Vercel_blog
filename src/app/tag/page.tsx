// src/app/tag/page.tsx

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getTags } from "@/lib/strapi"; // Usando a nova função
import { StrapiTag } from "@/types/strapi"; // Usando nosso tipo
import Link from "next/link";

// A função generateMetadata pode ser ajustada depois, se necessário
export async function generateMetadata() {
  return {
    title: "Tags",
    description: "Categorias e tópicos do blog.",
  };
}

export default async function Page() {
  // Buscando as tags do Strapi
  const tags: StrapiTag[] = await getTags();

  if (!tags) {
    return <div>Nenhuma tag encontrada.</div>;
  }

  return (
    <div className="container mx-auto px-5">
      <Header />
      <div className="mt-20 mb-12 text-center">
        <h1 className="mb-2 text-5xl font-bold">Tags</h1>
        <p className="text-lg opacity-50">Lista de todos os tópicos</p>
      </div>
      <div className="my-10 max-w-6xl text-balance text-center text-xl mb-48">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            // Usando os dados da estrutura do Strapi
            href={`/tag/${tag.attributes.slug}`}
            className="text-primary mr-2 inline-block"
          >
            #{tag.attributes.name}
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}