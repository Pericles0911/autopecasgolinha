module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define(
    'Produto',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sku: { type: DataTypes.STRING },
      nome: { type: DataTypes.STRING, allowNull: false },
      gtin: { type: DataTypes.STRING, allowNull: false, unique: true },
      descricao: { type: DataTypes.TEXT },
      quantidade: { type: DataTypes.INTEGER, defaultValue: 0 },
      categoria: { type: DataTypes.STRING },
      validade: { type: DataTypes.DATEONLY, allowNull: true },
      image_url: { type: DataTypes.TEXT },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'produtos',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Produto;
};
