const { DataTypes } = require("sequelize");
const sequelize = require("../configures/database");

const Blog = sequelize.define("Blog", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey:true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  authorId:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
  
});

module.exports = Blog;
