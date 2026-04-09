import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1>Autopeças Golinha</h1>
      </header>

      <main style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => nav('/fornecedores')}>
            Cadastrar Fornecedor
          </button>

          <button onClick={() => nav('/produtos')}>
            Cadastrar Produto
          </button>

          <button onClick={() => nav('/associacoes')}>
            Associar Produto-Fornecedor
          </button>
        </div>
      </main>
    </div>
  );
}
