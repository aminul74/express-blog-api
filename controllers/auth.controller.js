const { createToken } = require("../utils/JWT");
const authService = require("../services/auth.service");

const UserDtoFilter = require("../dto/user.dto");

const handleUserRegistration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new UserDtoFilter.UserRegRequestDto(username, email, password);

    const registeredUser = await authService.processUserRegistration(
      user.username,
      user.email,
      user.password
    );

    const userRegistrationToken = createToken(registeredUser.id);

    res.cookie("access-token", userRegistrationToken, {
      maxAge: 30 * 24 * 60 * 60,
    });

    return res.status(201).send(userRegistrationToken);
  } catch (error) {
    next(error);
  }
};

const handleLoginRequest = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userDto = new UserDtoFilter.UserLoginRequestDto(username, password);

    const isMatchedUsernamePassword = await authService.processUserLogin(
      userDto.username,
      userDto.password
    );

    const user = await authService.getUserByUsername(userDto.username);

    const userLoginToken = createToken(user.id);

    res.cookie("access-token", userLoginToken, { maxAge: 30 * 24 * 60 * 60 });

    res.status(200);
    res.send(userLoginToken);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUserRegistration,
  handleLoginRequest,
};
