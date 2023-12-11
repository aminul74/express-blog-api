const { createToken } = require("../utils/JWT");
const authService = require("../services/auth.service");
const { getContentBasedOnNegotiation } = require("../utils/responseType");
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

    const tokenResponse = { token: userRegistrationToken };
    const token = [tokenResponse];
    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(token, negotiate);
    return res.status(201).send(response);
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
      throw new Error("error");
    }

    const user = await authService.getUserByUsername(userDto.username);

    const userLoginToken = createToken(user.id);

    res.cookie("access-token", userLoginToken, { maxAge: 30 * 24 * 60 * 60 });
    const tokenResponse = { token: userLoginToken };
    const token = [tokenResponse];
    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(token, negotiate);
    res.status(200);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUserRegistration,
  handleLoginRequest,
};
