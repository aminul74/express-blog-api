const { DataTypes } = require('sequelize');
const sequelize = require("../repositories/database")
const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
      }
  }
)

module.exports = User;