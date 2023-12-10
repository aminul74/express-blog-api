const userService = require("../services/user.service");

const UserDtoFilter = require("../dto/user.dto");

const handleProfileGetRequest = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];
    const userData = await userService.userFromAuthToken(accessToken);
    // const userData = await userService.userFromAuthToken(
    //   req.cookies["access-token"]
    // );
    const user = userData.toJSON();
    return res.status(200).send({ ...user, password: undefined });
  } catch (error) {
    next(error);
  }
};

const handleProfileDeletionRequest = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];

    const user = await userService.userFromAuthToken(accessToken);

    const isDeletedUser = await userService.processUserDeleteById(user);

    return res.status(200).send("Delete Success!");
  } catch (error) {
    next(error);
  }
};

const handlePasswordUpdateRequest = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];

    const user = await userService.userFromAuthToken(accessToken);
    const userDto = new UserDtoFilter.UserUpdateRequestDto(old_password);

    const isPasswordUpdate = await userService.processUserUpdate(
      user,
      userDto,
      new_password
    );

    res.cookie("access-token", " ", {
      maxAge: -1,
    });

    return res.status(200).send("Password update success!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleProfileDeletionRequest,
  handleProfileGetRequest,
  handlePasswordUpdateRequest,
};
