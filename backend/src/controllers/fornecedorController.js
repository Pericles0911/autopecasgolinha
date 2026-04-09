const { Op } = require('sequelize');
const { Fornecedor } = require('../models');
const { fornecedorSchema } = require('../services/validation');

async function createFornecedor(req, res, next) {
  try {
    const { error, value } = fornecedorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'validation_error', fields: error.details });

    // normalize cnpj
    const cnpj = (value.cnpj || '').replace(/\D/g, '');
    const exists = await Fornecedor.findOne({ where: { cnpj } });
    if (exists) {
      return res.status(409).json({
        error: 'cnpj_exists',
        message: 'Erro: CNPJ já cadastrado.',
      });
    }

    const fornecedor = await Fornecedor.create({ ...value, cnpj });
    return res.status(201).json({ message: 'Fornecedor cadastrado com sucesso!', id: fornecedor.id });
  } catch (err) {
    next(err);
  }
}

async function searchFornecedores(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    const where = { deleted_at: null };

    if (q) {
      const qDigits = q.replace(/\D/g, '');
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${q}%` } },
        ...(qDigits ? [{ cnpj: { [Op.like]: `%${qDigits}%` } }] : []),
        { email: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const fornecedores = await Fornecedor.findAll({
      where,
      order: [['nome', 'ASC']],
      attributes: ['id', 'nome', 'cnpj', 'email', 'telefone', 'contato_principal'],
    });

    return res.status(200).json(fornecedores);
  } catch (err) {
    next(err);
  }
}

async function deleteFornecedor(req, res, next) {
  try {
    const id = req.params.id;

    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) return res.status(404).json({ error: 'not_found' });

    fornecedor.deleted_at = new Date();
    await fornecedor.save();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function restoreFornecedor(req, res, next) {
  try {
    const id = req.params.id;

    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) return res.status(404).json({ error: 'not_found' });

    if (!fornecedor.deleted_at) {
      return res.status(400).json({ error: 'invalid_state', message: 'Fornecedor não está arquivado' });
    }

    fornecedor.deleted_at = null;
    await fornecedor.save();

    return res.status(200).json({ message: 'Fornecedor restaurado com sucesso!', id: fornecedor.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createFornecedor,
  searchFornecedores,
  deleteFornecedor,
  restoreFornecedor,
};
