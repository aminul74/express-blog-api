const authRepositories = require("../repositories/auth.repository");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../utils/errors");
const { decodeToken } = require("../utils/JWT");

const processUserRegistration = async (username, email, password) => {
  const checkEmail = await authRepositories.findEmailByUserEmail(email);

  if (checkEmail) {
    const error = new Error("You are already registerd !");
    error.status = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const createNewUser = await authRepositories.createUser(
    username,
    email,
    (password = hashPassword)
  );

  return createNewUser;
};

const processUserLogin = async (username, password) => {
  const checkUserName = await authRepositories.loginUser(username);

  if (!checkUserName) {
    const error = new Error("Username not found");
    error.status = 404;
    throw error;
  }
  const isValid = await bcrypt.compare(password, checkUserName.password);

  if (!isValid) {
    const error = new Error("Wrong password");
    error.status = 401;
    throw error;
  }

  return isValid;
};

const getUserByUsername = async (username) => {
    const user = await authRepositories.getUserByUsername(username);
    if (!user) {
      throw new Error("Something went wrong, please try again!");
    }
    return user;
  };

module.exports = {
  processUserRegistration,
  processUserLogin,
  getUserByUsername
};
