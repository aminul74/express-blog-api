const User = require("../models/user.model");

const findEmailByUserEmail = async (email) => {
  return await User.findOne({ where: { email: email } });
};

const getUserByUsername = (username) => {
  return User.findOne({ where: { username } });
};
const loginUser = async (username) => {
  const res = await getUserByUsername(username);
  return res;
};

const createUser = async (username, email, hashPassword) => {
  return await User.create({ username, email, password: hashPassword });
};

module.exports = {
  findEmailByUserEmail,
  getUserByUsername,
  loginUser,
  createUser,
};
