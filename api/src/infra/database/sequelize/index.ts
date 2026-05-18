import { Sequelize } from "sequelize";

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')

export const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.POSTGRES_DATABASE || "study",
  username: process.env.POSTGRES_USER || "docker",
  password: process.env.POSTGRES_PASSWORD || "docker",
  host: process.env.POSTGRES_HOST || "database",
  port: Number(process.env.POSTGRES_PORT || 5432),
});
