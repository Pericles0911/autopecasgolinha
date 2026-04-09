const express = require('express');
const router = express.Router();

const fornecedorCtrl = require('../controllers/fornecedorController');
const produtoCtrl = require('../controllers/ProdutoController');
const assocCtrl = require('../controllers/associacaoController');

// Fornecedores
router.post('/fornecedores', fornecedorCtrl.createFornecedor);
router.get('/fornecedores', fornecedorCtrl.searchFornecedores);;
router.delete('/fornecedores/:id', fornecedorCtrl.deleteFornecedor);
router.post('/fornecedores/:id/restore', fornecedorCtrl.restoreFornecedor);

// Produtos
router.post('/produtos', produtoCtrl.createProduto);
router.get('/produtos', produtoCtrl.searchProdutos);
router.put('/produtos/:id', produtoCtrl.updateProduto);
router.delete('/produtos/:id', produtoCtrl.deleteProduto);

// Associações
router.post('/associacoes', assocCtrl.createAssociacao);
router.delete('/associacoes/:id', assocCtrl.deleteAssociacao);

module.exports = router;
