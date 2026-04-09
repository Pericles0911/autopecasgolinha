const { FornecedorProduto, Produto, Fornecedor, sequelize } = require('../models');

async function createAssociacao(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { produto_id, fornecedor_id, created_by } = req.body;

    const produto = await Produto.findByPk(produto_id);
    const fornecedor = await Fornecedor.findByPk(fornecedor_id);
    if (!produto || !fornecedor) {
      await t.rollback();
      return res.status(400).json({ error: 'invalid_reference', message: 'Produto ou fornecedor inválido.' });
    }

    
    const existing = await FornecedorProduto.findOne({
      where: { produto_id, fornecedor_id, status: 'active' },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existing) {
      await t.rollback();
      return res.status(409).json({
        error: 'association_exists',
        message: 'Este fornecedor já está associado a este produto.',
      });
    }

    const assoc = await FornecedorProduto.create(
      { produto_id, fornecedor_id, created_by, status: 'active' },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({
      message: 'Produto associado com sucesso.',
      associacao_id: assoc.id,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function deleteAssociacao(req, res, next) {
  try {
    const id = req.params.id;
    const assoc = await FornecedorProduto.findByPk(id);
    if (!assoc) return res.status(404).json({ error: 'not_found', message: 'Associação não encontrada.' });

    assoc.status = 'ended';
    assoc.ended_at = new Date();
    await assoc.save();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createAssociacao, deleteAssociacao };
