module.exports = (sequelize, DataTypes) => {
  const FornecedorProduto = sequelize.define(
    "FornecedorProduto",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      produto_id: { type: DataTypes.INTEGER, allowNull: false },
      fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
      data_associacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      status: { type: DataTypes.STRING, defaultValue: "active" },
      created_by: { type: DataTypes.STRING },
      ended_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "fornecedor_produto",
      timestamps: false,
      underscored: true,
    }
  );

  return FornecedorProduto;
};
