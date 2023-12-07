const userService = require("../services/user.service");

const UserDtoFilter = require("../dto/user.dto");

const handleProfileGetRequest = async (req, res, next) => {
  try {
    const userData = await userService.userFromAuthToken(
      req.cookies["access-token"]
    );
    // console.log("ZZZ", userData);
    const user = userData.toJSON();
    return res.status(200).send({ ...user, password: undefined });
  } catch (error) {
    next(error);
  }
};

const handleProfileDeletionRequest = async (req, res, next) => {
  try {
    const user = await userService.userFromAuthToken(
      req.cookies["access-token"]
    );

    const isDeletedUser = await userService.processUserDeleteById(user);

    if (!isDeletedUser) {
      const error = new Error("Unable to delete!");
      error.status = 400;
      throw error;
    }

    return res.status(200).send("Delete Success!");
  } catch (error) {
    next(error);
  }
};

const handlePasswordUpdateRequest = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    const user = await userService.userFromAuthToken(
      req.cookies["access-token"]
    );
    const userDto = new UserDtoFilter.UserUpdateRequestDto(old_password);

    const isPasswordUpdate = await userService.processUserUpdate(
      user,
      userDto, // { password: "oldPass" },
      new_password
    );

    if (!isPasswordUpdate) {
      const error = new Error("Unable to update password please try again!");
      error.status = 404;
      throw error;
    }

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
