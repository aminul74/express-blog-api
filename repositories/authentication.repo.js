const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const signUpRepo = async (username, email, password) => {
  try {
    const singleUser = await User.findOne({ where: { email: email } });

    if (singleUser) {
      const error = new Error("User already exist !");
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

const logInRepo = async (username, password) => {
  try {
    const findUserWithUserName = await User.findOne({
      where: { username: username },
    });

    if (!findUserWithUserName) {
      const error = new Error("Username not found");
      error.status = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(
      password,
      findUserWithUserName.password
    );

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

const getProfileFromRepo = async (user) => {
  try {
    const username = user.tokenParam;
    const userProfile = await User.findOne({
      where: { username },
      attributes: ["id", "username", "email"],
    });

    if (!userProfile) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return userProfile;
  } catch (error) {
    throw error;
  }
};

const deleteProfileFromRepo = async (user) => {
  try {
    const username = user.tokenParam;
    const deleteProfile = await User.destroy({
      where: { username },
    });

    if (!deleteProfile) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return deleteProfile;
  } catch (error) {
    throw error;
  }
};

const updateProfileFromRepo = async (userDtoBody) => {
  try {
    const username = userDtoBody.username;
    const foundUser = await User.findOne({
      where: { username: userDtoBody.username },
    });
    if (!foundUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const newPassword = foundUser.password;

    console.log("1st", newPassword);
    const updateProfile = await User.update(
      { password: newPassword },
      {
        where: { username: userDtoBody.username },
      }
    );
    console.log("2nd", updateProfile);
    return updateProfile;
    // if (!newPassword) {
    //   const error = new Error("New password is required");
    //   error.status = 400;
    //   throw error;
    // }

    // const updateProfile = await User.update(
    //   { password: newPassword },
    //   {
    //     where: { username },
    //   }
    // );

    // if (updateProfile[0] === 0) {
    //   const error = new Error("User not found");
    //   error.status = 404;
    //   throw error;
    // }

    // return updateProfile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signUpRepo,
  logInRepo,
  getProfileFromRepo,
  deleteProfileFromRepo,
  updateProfileFromRepo,
};
