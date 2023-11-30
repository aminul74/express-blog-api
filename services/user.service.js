const authRepositories = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../utils/errors");
const { decodeToken } = require("../utils/JWT");

const processUserRegistration = async (username, email, password) => {
  try {
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

    if (!createNewUser) {
      throw error;
    }

    return createNewUser;
  } catch (error) {
    throw error;
  }
};

const processUserLogin = async (username, password) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await authRepositories.getUserByUsername(username);
    if (!user) {
      throw new Error("Something went wrong, please try again!");
    }
    return user;
  } catch (error) {
    throw new Error("Something went wrong, please try again!");
  }
};

const userFromAuthToken = async (userToken) => {
  if (!userToken) {
    UnauthorizedError();
  }
  try {
    const data = await decodeToken(userToken);
    // console.log("token decode", data);
    const user = authRepositories.getUserById(data.id);

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
  
  try {
    const processToDelete = await authRepositories.deleteUserById(user.id)

    if (!processToDelete) {
      const error = new Error("Please try again");
      error.status = 400;
      throw error;
    }
    return processToDelete;
  } catch (error) {
    throw error
  }
};

const processUserUpdate = async (user, updateUser, new_password) => {
  try {
    
    const salt = await bcrypt.genSalt();

    const isValidPassword = await bcrypt.compare( updateUser.password, user.password );
  
    if (!isValidPassword) {
      const error = new Error("Wrong old password!");
      error.status = 400;
      throw error;
    }
    const newHashPassword = await bcrypt.hash(new_password, salt);
    // console.log("***", newHashPassword);

    const isUpdated = await authRepositories.updatePasswordByUser( user.id, newHashPassword );

    if (!isUpdated) {
      const error = new Error("Please try again");
      error.status = 400;
      throw error;
    }

    return isUpdated;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  processUserRegistration,
  processUserLogin,
  getUserByUsername,
  userFromAuthToken,
  processUserDeleteById,
  processUserUpdate,
};
