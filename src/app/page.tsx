// A diretiva de renderização dinâmica ainda é uma boa prática
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostsList } from "@/components/PostsList"; // Continuaremos usando o componente isolado

interface PageProps {
  // A prop é uma Promise que resolve para o objeto de parâmetros
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// A página agora precisa ser async para usar 'await'
const Page = async ({ searchParams }: PageProps) => {
  
  // A CORREÇÃO FINAL ESTÁ AQUI:
  // Nós esperamos a promise `searchParams` ser resolvida antes de usá-la.
  const resolvedSearchParams = await searchParams;
  
  // Agora usamos o objeto resolvido para obter a página
  const currentPage = typeof resolvedSearchParams?.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header />
      
      <Suspense fallback={<div className="text-center my-16">Carregando posts...</div>}>
        {/* Passamos o número da página resolvido para o componente filho */}
        <PostsList currentPage={currentPage} />
      </Suspense>
      
      <Footer />
    </div>
  );
};

export default Page;