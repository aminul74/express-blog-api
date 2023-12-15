const userRepositories = require("../repositories/user.repository");
const bcrypt = require("bcrypt");

const userByTokenId = async (data) => {
  const user = await userRepositories.getUserById(data.id);
  if (!user) {
    const error = new Error("Unauthorized!");
    error.status = 400;
    throw error;
  }
  return user;
};

const processUserDeleteById = async (user, userUUID) => {
  if (user.id !== userUUID) {
    const error = new Error("Invalid user ID");
    error.status = 400;
    throw error;
  }
  const processToDelete = await userRepositories.deleteUserById(user.id);

  if (!processToDelete) {
    const error = new Error("Please try again");
    error.status = 400;
    throw error;
  }
  return processToDelete;
};

const processUserUpdate = async (user, updateUser, new_password, userUUID) => {
  if (user.id !== userUUID) {
    const error = new Error("Invalid user ID");
    error.status = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt();

  const isValidPassword = await bcrypt.compare(
    updateUser.password,
    user.password
  );

  if (!isValidPassword) {
    const error = new Error("Wrong old password!");
    error.status = 400;
    throw error;
  }
  const newHashPassword = await bcrypt.hash(new_password, salt);

  const isUpdated = await userRepositories.updatePasswordByUser(
    user.id,
    newHashPassword
  );

  if (!isUpdated) {
    const error = new Error("Please try again");
    error.status = 400;
    throw error;
  }

  return isUpdated;
};

module.exports = {
  userByTokenId,
  processUserDeleteById,
  processUserUpdate,
};
