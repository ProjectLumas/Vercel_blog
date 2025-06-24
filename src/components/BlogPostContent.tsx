

"use client";
import { StrapiPost } from "@/types/strapi";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// Este componente renderiza o corpo principal do post
const PostBody = ({ content }: { content: any }) => {
  // O conteúdo do Strapi (Rich Text) vem como um array de blocos.
  // Vamos transformar isso em uma string de Markdown para o componente ReactMarkdown.
  const contentString = Array.isArray(content)
    ? content.map((block: any) => 
        block.children.map((child: any) => child.text).join('')
      ).join('\n\n')
    : ''; // Se não for um array, retorna uma string vazia para evitar erros.

  return (
    <div className="blog-content mx-auto">
      <ReactMarkdown>{contentString}</ReactMarkdown>
    </div>
  );
};

// Este é o componente principal da página de um post
export const BlogPostContent = ({ post }: { post: StrapiPost | null }) => {
  if (!post) return null;

  // CORREÇÃO: Acessamos as propriedades diretamente do 'post', sem 'attributes'.
  const { Title, publishedAt, createdAt, Content, tags } = post;

  return (
    <div>
      <div className="prose lg:prose-xl dark:prose-invert mx-auto lg:prose-h1:text-4xl mb-10 lg:mt-20 break-words">
        <h1>{Title}</h1>
        <PostBody content={Content} />

        <div className="mt-10 opacity-40 text-sm">
          {/* CORREÇÃO: Acessamos as tags diretamente */}
          {tags?.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.Slug}`}
              className="text-primary mr-2"
            >
              #{tag.Name}
            </Link>
          ))}
        </div>
        <div className="text-sm opacity-40 mt-4">
          {new Intl.DateTimeFormat("pt-BR").format(
            new Date(publishedAt || createdAt)
          )}
        </div>
      </div>
    </div>
  );
};