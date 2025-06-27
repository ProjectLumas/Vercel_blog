// src/components/CommentList.tsx
"use client";
import { CleanComment } from "@/types/strapi";
import { format } from "date-fns";

export function CommentList({ comments }: { comments: CleanComment[] }) {
  if (!comments || comments.length === 0) {
    return (<div className="text-muted-foreground mt-8 text-center">Nenhum comentário ainda. Seja o primeiro a comentar!</div>);
  }
  return (
    <div className="mt-10 space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="font-medium">{comment.author}</span></div>
              <div className="text-muted-foreground text-sm">{format(new Date(comment.createdAt), "PPp")}</div>
            </div>
            <div className="mt-2 whitespace-pre-line text-sm">{comment.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}