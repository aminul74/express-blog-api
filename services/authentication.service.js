const { createToken } = require("../utils/JWT");
const authenticRepo = require("../repositories/authentication.repo");

const signUp = async (userDtoBody) => {
  try {
    const createNewUser = await authenticRepo.signUpRepo(
      userDtoBody.username,
      userDtoBody.email,
      userDtoBody.password
    );
    const token = createToken(createNewUser);
    return token;
  } catch (error) {
    throw error;
  }
};

const logIn = async (userDtoBody) => {
  try {
    const successfullLogedInUser = await authenticRepo.logInRepo(
      userDtoBody.username,
      userDtoBody.password
    );
    if (successfullLogedInUser) {
      const token = createToken(userDtoBody.username);
      return token;
    } else {
      throw new Error("Invalid username or password!");
    }
  } catch (error) {
    throw error;
  }
};

const getProfileService = async (user) => {
  try {
    const getProfile = await authenticRepo.getProfileFromRepo(user);
    return getProfile;
  } catch (error) {
    throw error;
  }
};

const deleteProfileService = async (user) => {
  try {
    const deleteProfileProfile = await authenticRepo.deleteProfileFromRepo(
      user
    );
    return deleteProfileProfile;
  } catch (error) {
    throw error;
  }
};

const updateProfileService = async (userDtoBody) => {
  try {
    const updateProfile = await authenticRepo.updateProfileFromRepo(userDtoBody);
    return updateProfile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signUp,
  logIn,
  getProfileService,
  deleteProfileService,
  updateProfileService,
};
