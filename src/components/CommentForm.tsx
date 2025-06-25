// src/components/CommentForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createComment } from "@/lib/strapi"; // Apenas import do Strapi

const formSchema = z.object({
  author: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  content: z.string().min(1, "O comentário não pode estar vazio"),
});

interface CommentFormProps {
  slug: string;
  onSuccess?: () => void;
}

export function CommentForm({ slug, onSuccess }: CommentFormProps) {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Seu comentário foi enviado." });
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (e) => {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { author: "", email: "", content: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({ ...values, postSlug: slug });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="author" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl><Input placeholder="Seu nome" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Comentário</FormLabel>
            <FormControl><Textarea placeholder="Deixe seu comentário..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar Comentário"}
        </Button>
      </form>
    </Form>
  );
}