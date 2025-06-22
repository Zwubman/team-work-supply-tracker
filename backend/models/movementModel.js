// models/movementModel.js
export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Movement",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      movementType: {
        type: DataTypes.ENUM("inbound", "outbound"),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "items",
          key: "id",
        },
      },
    },
    {
      tableName: "movements",
      timestamps: true,
    }
  );
};
