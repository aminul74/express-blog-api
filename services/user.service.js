const userRepositories = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../utils/errors");
const { decodeToken } = require("../utils/JWT");

// const processUserRegistration = async (username, email, password) => {
//   const checkEmail = await userRepositories.findEmailByUserEmail(email);

//   if (checkEmail) {
//     const error = new Error("You are already registerd !");
//     error.status = 409;
//     throw error;
//   }

//   const salt = await bcrypt.genSalt();
//   const hashPassword = await bcrypt.hash(password, salt);

//   const createNewUser = await userRepositories.createUser(
//     username,
//     email,
//     (password = hashPassword)
//   );

//   return createNewUser;
// };

// const processUserLogin = async (username, password) => {
//   const checkUserName = await userRepositories.loginUser(username);

//   if (!checkUserName) {
//     const error = new Error("Username not found");
//     error.status = 404;
//     throw error;
//   }
//   const isValid = await bcrypt.compare(password, checkUserName.password);

//   if (!isValid) {
//     const error = new Error("Wrong password");
//     error.status = 401;
//     throw error;
//   }

//   return isValid;
// };

// const getUserByUsername = async (username) => {
//   const user = await userRepositories.getUserByUsername(username);
//   if (!user) {
//     throw new Error("Something went wrong, please try again!");
//   }
//   return user;
// };

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
  // processUserRegistration,
  // processUserLogin,
  // getUserByUsername,
  userFromAuthToken,
  processUserDeleteById,
  processUserUpdate,
};
