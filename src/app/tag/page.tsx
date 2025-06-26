// src/app/tag/page.tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getTags } from "@/lib/strapi";
import { CleanTag } from "@/types/strapi";
import Link from "next/link";

export default async function Page() {
  const tags: CleanTag[] = await getTags();
  if (!tags) return <div>Nenhuma tag encontrada.</div>;
  return (
    <div className="container mx-auto px-5">
      <Header />
      <div className="mt-20 mb-12 text-center"><h1 className="mb-2 text-5xl font-bold">Tags</h1><p className="text-lg opacity-50">Lista de todos os tópicos</p></div>
      <div className="my-10 max-w-6xl text-balance text-center text-xl mb-48">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tag/${tag.Slug}`} className="text-primary mr-2 inline-block">#{tag.Name}</Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}