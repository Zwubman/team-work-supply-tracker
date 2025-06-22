// models/itemModel.js
export default (sequelize, DataTypes) => {
  return sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SKU: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pictureUrl: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    
  }, {
    tableName: 'items',
    timestamps: true,
  });
};
