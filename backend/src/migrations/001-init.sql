-- =========================
-- TABELA: fornecedores
-- =========================
CREATE TABLE IF NOT EXISTS fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20) NOT NULL UNIQUE,
  endereço VARCHAR (255) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contato_principal VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP NULL
);

-- =========================
-- TABELA: produtos
-- =========================
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100),
  nome VARCHAR(255) NOT NULL,
  gtin VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT,
  quantidade INTEGER DEFAULT 0,
  categoria VARCHAR(255),
  validade DATE,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP NULL
);

-- =========================
-- TABELA: fornecedor_produto (tabela de junção)
-- =========================
CREATE TABLE IF NOT EXISTS fornecedor_produto (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
  data_associacao TIMESTAMP DEFAULT now(),
  status VARCHAR(50) DEFAULT 'active',
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  ended_at TIMESTAMP NULL
);

-- =========================
-- ÍNDICES / CONSTRAINTS
-- =========================

-- Evita duplicar a MESMA associação (produto_id + fornecedor_id)
CREATE UNIQUE INDEX IF NOT EXISTS ux_fornecedor_produto_unique
ON fornecedor_produto (produto_id, fornecedor_id);

-- (Opcional, recomendado) melhora performance para listar fornecedores de um produto
CREATE INDEX IF NOT EXISTS ix_fornecedor_produto_produto_id
ON fornecedor_produto (produto_id);

-- (Opcional, recomendado) melhora performance para listar produtos de um fornecedor
CREATE INDEX IF NOT EXISTS ix_fornecedor_produto_fornecedor_id
ON fornecedor_produto (fornecedor_id);
