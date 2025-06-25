// src/app/page.tsx

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostsList } from "@/components/PostsList";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
  // CORREÇÃO: Usando 'await' para resolver a promise antes de usá-la
  const resolvedSearchParams = await searchParams;
  const currentPage = typeof resolvedSearchParams?.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header />
      <Suspense fallback={<div className="text-center my-16">Carregando posts...</div>}>
        <PostsList currentPage={currentPage} />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Page;