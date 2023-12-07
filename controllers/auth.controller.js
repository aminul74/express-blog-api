const { createToken } = require("../utils/JWT");
const authService = require("../services/auth.service");

const UserDtoFilter = require("../dto/user.dto");

const handleUserRegistration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new UserDtoFilter.UserRegRequestDto(username, email, password);

    const responseData = await authService.processUserRegistration(
      user.username,
      user.email,
      user.password
    );

    if (!responseData) {
      throw new Error("Signup Failed");
    }

    const userRegistrationToken = createToken(responseData.id);

    res.cookie("access-token", userRegistrationToken, {
      maxAge: 30 * 24 * 60 * 60,
    });

    return res.status(201).send("Signup Success!");
  } catch (error) {
    next(error);
  }
};

const handleLoginRequest = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userDto = new UserDtoFilter.UserLoginRequestDto(username, password);

    const isMatchedUsernamePassword = await authService.processUserLogin(
      //CheckUsernameAndPassword
      userDto.username,
      userDto.password
    );

    if (!isMatchedUsernamePassword) {
      throw new Error("Username or password is incorrect.");
    }

    const user = await authService.getUserByUsername(userDto.username);

    const userLoginToken = createToken(user.id);

    res.cookie("access-token", userLoginToken, { maxAge: 30 * 24 * 60 * 60 });

    res.status(200);
    res.send("Login Success!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUserRegistration,
  handleLoginRequest,
};
