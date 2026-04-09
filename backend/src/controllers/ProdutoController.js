const { Op } = require('sequelize');
const { Produto } = require('../models');
const { produtoSchema } = require('../services/validation');

async function createProduto(req, res, next) {
  try {
    const { error, value } = produtoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'validation_error', fields: error.details });

    const gtin = (value.gtin || '').replace(/\D/g, '');
    const exists = await Produto.findOne({ where: { gtin } });
    if (exists) {
      return res.status(409).json({
        error: 'gtin_exists',
        message: 'Erro: código de barras (GTIN) já cadastrado.',
      });
    }

    const produto = await Produto.create({ ...value, gtin });
    return res.status(201).json({ message: 'Produto cadastrado com sucesso!', id: produto.id });
  } catch (err) {
    next(err);
  }
}

async function searchProdutos(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    const qDigits = q.replace(/\D/g, '');

    const where = { deleted_at: null };

    if (q) {
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${q}%` } },
        { sku: { [Op.iLike]: `%${q}%` } },
        ...(qDigits ? [{ gtin: { [Op.like]: `%${qDigits}%` } }] : []),
      ];
    }

    const produtos = await Produto.findAll({
      where,
      limit: 50,
      order: [['nome', 'ASC']],
      // garante que vem tudo que sua tela usa
      attributes: ['id', 'nome', 'gtin', 'descricao', 'sku', 'image_url'],
    });

    return res.status(200).json(produtos);
  } catch (err) {
    next(err);
  }
}

async function updateProduto(req, res, next) {
  try {
    const id = req.params.id;
    const { error, value } = produtoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'validation_error', fields: error.details });

    const produto = await Produto.findByPk(id);
    if (!produto) return res.status(404).json({ error: 'not_found' });

   
    if (value.gtin) value.gtin = value.gtin.replace(/\D/g, '');

    
    if (value.gtin && value.gtin !== produto.gtin) {
      const exists = await Produto.findOne({ where: { gtin: value.gtin } });
      if (exists) {
        return res.status(409).json({
          error: 'gtin_exists',
          message: 'Erro: código de barras (GTIN) já cadastrado.',
        });
      }
    }

    await produto.update(value);
    return res.status(200).json({ message: 'Produto atualizado com sucesso!' });
  } catch (err) {
    next(err);
  }
}

async function deleteProduto(req, res, next) {
  try {
    const id = req.params.id;
    const produto = await Produto.findByPk(id);
    if (!produto) return res.status(404).json({ error: 'not_found' });

    produto.deleted_at = new Date();
    await produto.save();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createProduto, searchProdutos, updateProduto, deleteProduto };
