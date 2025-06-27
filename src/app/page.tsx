// src/app/page.tsx

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostsList } from "@/components/PostsList"; // Importamos nosso componente que busca os dados

interface PageProps {
  searchParams?: {
    page?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header />
      
      {/* O Suspense mostra um fallback enquanto o PostsList busca os dados. */}
      <Suspense fallback={<div className="text-center my-16">Carregando posts...</div>}>
        <PostsList currentPage={currentPage} />
      </Suspense>
      
      <Footer />
    </div>
  );
};

export default Page;