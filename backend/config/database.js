// db.js (ESM version)
import { Sequelize } from "sequelize";
import configJSON from './config.js' 

const env = process.env.NODE_ENV || "development";
const config = configJSON[env];

const db = new Sequelize({
  database: config.database,
  username: config.username,
  password: String(config.password),
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default db;
