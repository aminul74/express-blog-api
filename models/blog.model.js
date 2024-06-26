const { DataTypes } = require("sequelize");
const sequelize = require("../configures/database");

const Blog = sequelize.define("Blog", {
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  
});

module.exports = Blog;
