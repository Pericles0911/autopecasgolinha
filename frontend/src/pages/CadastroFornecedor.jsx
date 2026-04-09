import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormFornecedor from '../components/FormFornecedor';

export default function CadastroFornecedor() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      {/* Cabeçalho */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <div /> {/* espaço à esquerda */}
        <h2 style={{ margin: 0, textAlign: 'center' }}>
          Cadastro de Fornecedor
        </h2>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => nav('/')}>Voltar</button>
        </div>
      </header>

      {/* Card do formulário */}
      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
          padding: 24,
          border: '1px solid #ddd',
          borderRadius: 12,
          background: '#fff',
        }}
      >
        <FormFornecedor />
      </div>
    </div>
  );
}
