// src/components/BlogPostContent.tsx
"use client";
import { CleanPost } from "@/types/strapi";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const PostBody = ({ content }: { content: any }) => {
  const contentString = Array.isArray(content)
    ? content.map((block: any) => block.children.map((child: any) => child.text).join('')).join('\n\n')
    : '';
  return (<div className="blog-content mx-auto"><ReactMarkdown>{contentString}</ReactMarkdown></div>);
};

export const BlogPostContent = ({ post }: { post: CleanPost | null }) => {
  if (!post) return null;
  const { Title, publishedAt, createdAt, Content, tags } = post;
  return (
    <div>
      <div className="prose lg:prose-xl dark:prose-invert mx-auto lg:prose-h1:text-4xl mb-10 lg:mt-20 break-words">
        <h1>{Title}</h1>
        <PostBody content={Content} />
        <div className="mt-10 opacity-40 text-sm">{tags?.map((tag) => (<Link key={tag.id} href={`/tag/${tag.Slug}`} className="text-primary mr-2">#{tag.Name}</Link>))}</div>
        <div className="text-sm opacity-40 mt-4">{new Intl.DateTimeFormat("pt-BR").format(new Date(publishedAt || createdAt))}</div>
      </div>
    </div>
  );
};