const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("blog_server", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Sync Success!");
  })
  .catch(() => {
    console.log("Not synced.");
  });

module.exports = sequelize;