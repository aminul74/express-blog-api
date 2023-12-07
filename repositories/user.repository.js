const User = require("../models/user.model");

const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "username", "email", "password"],
  });
};

const deleteUserById = async (id) => {
  return await User.destroy({
    where: { id },
  });
};

const updatePasswordByUser = async (userId, newHashPassword) => {
  return await User.update(
    { password: newHashPassword },
    { where: { id: userId } }
  );
};

const getUserByUsername = (username) => {
  return User.findOne({ where: { username } });
};

// const findEmailByUserEmail = async (email) => {
//   return await User.findOne({ where: { email: email } });
// };

// const createUser = async (username, email, hashPassword) => {
//   return await User.create({ username, email, password: hashPassword });
// };

// const loginUser = async (username) => {
//   const res = await getUserByUsername(username);
//   return res;
// };

module.exports = {
  // createUser,
  // findEmailByUserEmail,
  // loginUser,
  getUserByUsername,
  getUserById,
  deleteUserById,
  updatePasswordByUser,
};
