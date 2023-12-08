const userRepositories = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../utils/errors");
const { decodeToken } = require("../utils/JWT");

const userFromAuthToken = async (userToken) => {
  if (!userToken) {
    UnauthorizedError();
  }
  try {
    const data = await decodeToken(userToken);

    const user = userRepositories.getUserById(data.id);

    if (!user) {
      UnauthorizedError();
    }

    return user;
  } catch (error) {
    console.log("error", error);
    UnauthorizedError();
  }
};

const processUserDeleteById = async (user) => {
  const processToDelete = await userRepositories.deleteUserById(user.id);

  if (!processToDelete) {
    const error = new Error("Please try again");
    error.status = 400;
    throw error;
  }
  return processToDelete;
};

const processUserUpdate = async (user, updateUser, new_password) => {
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
  userFromAuthToken,
  processUserDeleteById,
  processUserUpdate,
};
