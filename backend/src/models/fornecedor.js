module.exports = (sequelize, DataTypes) => {
  const Fornecedor = sequelize.define('Fornecedor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    contato_principal: { type: DataTypes.STRING },

    endereco: { type: DataTypes.TEXT }, // 

    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'fornecedores',
    timestamps: false // ou true conforme seu projeto
  });

  return Fornecedor;
};

