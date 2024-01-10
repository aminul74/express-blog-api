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

module.exports = {
  getUserByUsername,
  getUserById,
  deleteUserById,
  updatePasswordByUser,
};
