const Joi = require('joi');

const fornecedorSchema = Joi.object({
  nome: Joi.string().min(2).max(255).required(),
  cnpj: Joi.string().required(),
  endereco: Joi.string().allow('', null),
  telefone: Joi.string().required(),
  email: Joi.string().email().required(),
  contato_principal: Joi.string().allow('', null),
});

const produtoSchema = Joi.object({
  sku: Joi.string().allow('', null),
  nome: Joi.string().min(2).max(255).required(),
  gtin: Joi.string().required(),
  descricao: Joi.string().allow('', null),
  quantidade: Joi.number().integer().min(0).allow(null),
  categoria: Joi.string().allow('', null),
  validade: Joi.date().allow(null),
  image_url: Joi.string().allow('', null),
});

module.exports = { fornecedorSchema, produtoSchema };
