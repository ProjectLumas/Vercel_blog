// src/components/CommentSection.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/lib/strapi";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { CleanComment } from "@/types/strapi"; // CORREÇÃO: Importando o tipo correto

interface CommentSectionProps {
  slug: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  // CORREÇÃO: Usando o tipo 'CleanComment[]'
  const { data: comments, isLoading, refetch } = useQuery<CleanComment[]>({
    queryKey: ["comments", slug],
    queryFn: () => getComments(slug),
  });

  if (isLoading) {
    return <div>Carregando comentários...</div>;
  }

  return (
    <div className="my-8">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Adicionar Comentário</h2>
      <CommentForm slug={slug} onSuccess={refetch} />
      
      <h2 className="mb-8 mt-16 text-2xl font-bold tracking-tight">Comentários</h2>
      <CommentList comments={comments || []} />
    </div>
  );
}