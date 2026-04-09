// backend/tests/integration/fornecedores_produtos.test.js
const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

beforeAll(async () => {
  // Atenção: isso vai recriar as tabelas no banco apontado pela configuração.
  // Execute os testes contra um banco de testes (ex.: DATABASE_URL apontando para DB de teste).
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Integração - Fornecedores e Produtos', () => {
  describe('POST /api/fornecedores', () => {
    const fornecedorPayload = {
      nome: 'Auto Peças Teste Ltda',
      cnpj: '11444777000161', // CNPJ válido de exemplo
      telefone: '85999998888',
      email: 'teste@fornecedor.com',
      contato_principal: 'Péricles'
    };

    test('Cria fornecedor com 201 e mensagem esperada', async () => {
      const res = await request(app)
        .post('/api/fornecedores')
        .send(fornecedorPayload)
        .set('Accept', 'application/json');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Fornecedor cadastrado com sucesso!');
      expect(res.body).toHaveProperty('id');
    });

    test('Tenta criar fornecedor duplicado e recebe 409', async () => {
      const res = await request(app)
        .post('/api/fornecedores')
        .send(fornecedorPayload)
        .set('Accept', 'application/json');

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'cnpj_exists');
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/produtos', () => {
    const produtoPayload = {
      nome: 'Filtro de Óleo Teste',
      gtin: '7891234567895', // GTIN-13 válido de exemplo
      descricao: 'Filtro de óleo para teste',
      quantidade: 10,
      categoria: 'Filtros',
      validade: '2026-12-31',
      image_url: ''
    };

    test('Cria produto com 201 e mensagem esperada', async () => {
      const res = await request(app)
        .post('/api/produtos')
        .send(produtoPayload)
        .set('Accept', 'application/json');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Produto cadastrado com sucesso!');
      expect(res.body).toHaveProperty('id');
    });

    test('Tenta criar produto duplicado (mesmo GTIN) e recebe 409', async () => {
      const res = await request(app)
        .post('/api/produtos')
        .send(produtoPayload)
        .set('Accept', 'application/json');

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'gtin_exists');
      expect(res.body).toHaveProperty('message');
    });
  });
});
