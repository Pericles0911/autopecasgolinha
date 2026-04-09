import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormProduto from '../components/FormProduto';

export default function CadastroProduto() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <div />
        <h2 style={{ margin: 0, textAlign: 'center' }}>Cadastro de Produtos</h2>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => nav('/')}>Voltar</button>
        </div>
      </header>

      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 24,
          border: '1px solid #ddd',
          borderRadius: 12,
          background: '#fff',
        }}
      >
        <FormProduto />
      </div>
    </div>
  );
}
