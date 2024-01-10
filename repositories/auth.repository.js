const User = require("../models/user.model");

const findEmailByUserEmail = (email) => {
  return User.findOne({ where: { email: email } });
};

const getUserByUsername = (username) => {
  return User.findOne({ where: { username } });
};

const createUser = async (username, email, hashPassword) => {
  return await User.create({ username, email, password: hashPassword });
};

module.exports = {
  findEmailByUserEmail,
  getUserByUsername,
  createUser,
};
