import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home.jsx';
import CadastroFornecedor from './pages/CadastroFornecedor.jsx';
import CadastroProduto from './pages/CadastroProduto.jsx';
import Associacao from './pages/Associacao.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Rotas principais */}
        <Route path="/fornecedores" element={<CadastroFornecedor />} />
        <Route path="/produtos" element={<CadastroProduto />} />
        <Route path="/associacoes" element={<Associacao />} />

        {/* Aliases para rotas que você tentou acessar */}
        <Route path="/fornecedores/cadastrar" element={<Navigate to="/fornecedores" replace />} />
        <Route path="/produtos/cadastrar" element={<Navigate to="/produtos" replace />} />
        <Route path="/associacao" element={<Navigate to="/associacoes" replace />} />

        {/* fallback opcional */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
