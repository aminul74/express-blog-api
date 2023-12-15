const userService = require("../services/user.service");
const { getContentBasedOnNegotiation } = require("../utils/responseType");
const UserDtoFilter = require("../dto/user.dto");

const handleProfileGetRequest = async (req, res, next) => {
  try {
    const userData = req.user;
    const user = userData.toJSON();
    const userProfile = [user];

    const negotiate = req.accepts(["json", "text", "xml", "html"]);
    res.type(negotiate);

    const response = await getContentBasedOnNegotiation(userProfile, negotiate);

    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handleProfileDeletionRequest = async (req, res, next) => {
  try {
    const userUUID = req.params.uuid;
    const userData = req.user;
    await userService.processUserDeleteById(userData, userUUID);

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(
      [{ Message: "Delete Success!" }],
      negotiate
    );
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handlePasswordUpdateRequest = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    const userUUID = req.params.uuid;

    const userDto = new UserDtoFilter.UserUpdateRequestDto(old_password);

    const userData = req.user;

    await userService.processUserUpdate(
      userData,
      userDto,
      new_password,
      userUUID
    );

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(
      [{ Message: "Password update success!" }],
      negotiate
    );

    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleProfileDeletionRequest,
  handleProfileGetRequest,
  handlePasswordUpdateRequest,
};
