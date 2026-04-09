const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Fornecedor = require('./fornecedor')(sequelize, DataTypes);
const Produto = require('./produto')(sequelize, DataTypes);
const FornecedorProduto = require('./fornecedorProduto')(sequelize, DataTypes);

// Associations
Fornecedor.belongsToMany(Produto, {
  through: FornecedorProduto,
  foreignKey: 'fornecedor_id',
  otherKey: 'produto_id',
  as: 'produtos',
});

Produto.belongsToMany(Fornecedor, {
  through: FornecedorProduto,
  foreignKey: 'produto_id',
  otherKey: 'fornecedor_id',
  as: 'fornecedores',
});

module.exports = {
  sequelize,
  Fornecedor,
  Produto,
  FornecedorProduto,
};
