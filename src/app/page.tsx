// src/app/page.tsx - MODO DE DEPURAÇÃO DE VARIÁVEL DE AMBIENTE

// Importante: Não faremos busca de dados, apenas renderização simples.
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Page = () => {
  // Tentamos ler a variável de ambiente diretamente do processo do servidor.
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  return (
    <div className="container mx-auto px-5">
      <Header />
      <div className="my-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Teste de Variável de Ambiente</h1>
        <p className="mb-2">O valor de NEXT_PUBLIC_STRAPI_API_URL que a Vercel está lendo é:</p>
        <pre 
          style={{ 
            color: strapiUrl ? 'green' : 'red', 
            border: '2px solid black', 
            padding: '20px', 
            fontSize: '1.2rem',
            wordWrap: 'break-word'
          }}
        >
          {strapiUrl || "ERRO: A VARIÁVEL NÃO FOI ENCONTRADA!"}
        </pre>
      </div>
      <Footer />
    </div>
  );
};

export default Page;