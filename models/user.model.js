const { DataTypes } = require("sequelize");
const sequelize = require("../configures/database");
const Blog = require("../models/blog.model");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});

User.hasMany(Blog, { foreignKey: "authorId" });
Blog.belongsTo(User, { foreignKey: "authorId" });

module.exports = User;
