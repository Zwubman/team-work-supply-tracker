// models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/database.js';
import defineUser from './userModel.js';
import defineMovement from './movementModel.js';
import defineItem from './itemModel.js';
import defineSupply from './supplyModel.js';

const User = defineUser(db, DataTypes);
const Movement = defineMovement(db, DataTypes);
const Item = defineItem(db, DataTypes);
const Supply = defineSupply(db, DataTypes);

const models = {
  User,
  Movement,
  Item,
  Supply,
};

Supply.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});
Item.hasMany(Supply, {
  foreignKey: 'itemId',
  as: 'supplies',
});

Supply.belongsTo(User, {
  foreignKey: 'requestedBy',
  as: 'supplier',
  onDelete: 'CASCADE',
});
Supply.belongsTo(User, {
  foreignKey: 'approvedBy',
  as: 'approvedByUser',
  onDelete: 'CASCADE',
});
Supply.belongsTo(User, {
  foreignKey: 'rejectedBy',
  as: 'rejectedByUser',
  onDelete: 'CASCADE',
});
User.hasMany(Supply, {
  foreignKey: 'supplierId',
  as: 'suppliedEntries',
});

Item.hasMany(Movement, {
  foreignKey: 'itemId',
  as: 'movements',
});
Movement.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});

User.hasMany(Movement, {
  foreignKey: 'movedBy',
  as: 'movements',
});
Movement.belongsTo(User, {
  foreignKey: 'movedBy',
  as: 'movedByUser', // you can name this however you'd like
});


export default {
  sequelize: db,
  Sequelize,
  ...models
};
