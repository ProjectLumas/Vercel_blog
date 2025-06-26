// src/app/page.tsx - MODO DE DEPURAÇÃO COM LINTING CORRIGIDO

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPosts } from "@/lib/strapi"; 

export const dynamic = 'force-dynamic';

const Page = async () => {
  try {
    const result = await getPosts({ page: 1 });

    if (!result || !result.data) {
      return (
        <div className="container mx-auto px-5">
          <Header />
          <div className="my-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Erro na Resposta da API</h1>
            {/* CORREÇÃO: Usando &apos; para o apóstrofo */}
            <p>A API foi chamada, mas não retornou a estrutura de dados esperada (sem a chave &apos;data&apos;).</p>
            <pre style={{ border: '1px solid black', padding: '10px', textAlign: 'left', marginTop: '20px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="container mx-auto px-5">
        <Header />
        <div className="my-16">
          <h1 className="text-2xl font-bold mb-4 text-center text-green-600">Sucesso! Dados Recebidos da API:</h1>
          <pre style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', padding: '20px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
        <Footer />
      </div>
    );

  } catch (error: any) {
    return (
      <div className="container mx-auto px-5">
        <Header />
        <div className="my-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Erro Durante a Busca de Dados!</h1>
          <p>A função getPosts falhou com a seguinte mensagem:</p>
          <pre style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
            {error.message}
          </pre>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Page;