require("dotenv").config();
const { Sequelize } = require("sequelize");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Sync Success!");
  })
  .catch((error) => {
    console.error("Error syncing the database:", error.message);
  });

module.exports = sequelize;
