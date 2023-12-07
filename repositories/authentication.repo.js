const User = require("../models/user.model");

const getUserById = async(data) => {
  const {id} = data;
  if (!id) {
    throw new Error("Invalid data: 'id' is missing or undefined");
  }
  return await User.findOne({ where: { id: id} });
};

const getUserByUsername = (username) => {
  return User.findOne({ where: { username } });
};

const findEmailByUserEmail = async(email) =>{
  return await User.findOne({where: { email : email }});
}

const createUser = async(username, email, hashPassword) => {
  return await User.create({username,email, password:hashPassword});
};

const loginUser = async(username) =>{
  const res = await getUserByUsername(username);
  return res;
}


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
  createUser,
  findEmailByUserEmail,
  loginUser,
  getUserByUsername,
  getUserById,
  getProfileFromRepo,
  deleteProfileFromRepo,
  updateProfileFromRepo,
};
