const { decodeToken, createToken } = require("../utils/JWT");
const userService = require("../services/user.service");
const {
  UserRegRequestDto,
  UserLoginRequestDto,
  UserUpdateRequestDto,
} = require("../dto/user.dto");


const handleUserRegistration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new UserRegRequestDto(username, email, password);

    const responseData = await userService.processUserRegistration(
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
    const userDto = new UserLoginRequestDto(username, password);

    const isMatchedUsernamePassword = await userService.processUserLogin(
      //CheckUsernameAndPassword
      userDto.username,
      userDto.password
    );

    if (!isMatchedUsernamePassword) {
      throw new Error("Login Failed");
    }

    const user = await userService.getUserByUsername(userDto.username);
    // console.log("xxx", user, userDto.username);

    const userLoginToken = createToken(user.id);

    res.cookie("access-token", userLoginToken, { maxAge: 30 * 24 * 60 * 60 });

    return res.status(200).send("Login Success!");
  } catch (error) {
    next(error);
  }
};

const handleProfileGetRequest = async (req, res, next) => {
  try {
    const userToken = req.cookies["access-token"];
    // console.log("userToken", userToken);

    const user = await userService.userFromAuthToken(userToken);

    const userData = user.toJSON();
    return res.status(200).send({ ...userData, password: undefined });
  } catch (error) {
    next(error);
  }
};

const handleProfileDeletionRequest = async (req, res, next) => {
  try {
    const userToken = req.cookies["access-token"];

    // console.log("userToken", userToken);

    const user = await userService.userDeleteFromAuthToken(userToken);

    if (!user) {
      const error = new Error("Unable to delete");
      error.status = 404;
      throw error;
    }

    return res.status(200).send("Delete Success!");
  } catch (error) {
    next(error);
  }
};

const handlePasswordUpdateRequest = async (req, res, next) => {
  try {
    const user = await userService.userFromAuthToken(
      req.cookies["access-token"]
    );

    const { password } = req.body;
    // console.log("userToken", userToken);

    const userDto = new UserUpdateRequestDto(password);
    // console.log("check**:",userDto)
    const isPasswordUpdate = await userService.userUpdateProcess(
      user.id,
      userDto
    );
    if (!isPasswordUpdate) {
      const error = new Error("Unable to update password please try again!");
      error.status = 404;
      throw error;
    }

    return res.status(200).send("Password update success!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUserRegistration,
  handleLoginRequest,
  handleProfileDeletionRequest,
  handleProfileGetRequest,
  handlePasswordUpdateRequest,
};
