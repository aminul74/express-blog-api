const jwtToken = require("../utils/JWT");
const authenticRepo = require("../repositories/authentication.repo");

const signUp = async (userDtoBody) => {
  try {
    const createNewUser = await authenticRepo.signUpRepo(
      userDtoBody.username,
      userDtoBody.email,
      userDtoBody.password
    );
    const token = jwtToken(createNewUser);
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
    const token = jwtToken(successfullLogedInUser);
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { signUp, logIn };
