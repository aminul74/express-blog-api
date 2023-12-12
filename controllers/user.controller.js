const userService = require("../services/user.service");
const { getContentBasedOnNegotiation } = require("../utils/responseType");
const UserDtoFilter = require("../dto/user.dto");

const handleProfileGetRequest = async (req, res, next) => {
  try {
    const userData = req.user;
    const user = userData.toJSON();
    const userProfile = [user];

    const negotiate = req.accepts(["json", "text", "xml", "html"]);
    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(userProfile, negotiate);

    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handleProfileDeletionRequest = async (req, res, next) => {
  try {
    const userData = req.user;
    const isDeletedUser = await userService.processUserDeleteById(userData);

    return res.status(200).send("Delete Success!");
  } catch (error) {
    next(error);
  }
};

const handlePasswordUpdateRequest = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    const userDto = new UserDtoFilter.UserUpdateRequestDto(old_password);

    const userData = req.user;

    const isPasswordUpdate = await userService.processUserUpdate(
      userData,
      userDto,
      new_password
    );

    // res.cookie("access-token", " ", {
    //   maxAge: -1,
    // });

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
