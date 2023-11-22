const fromService = require("../services/authentication.service");
const { UserRegRequestDto, UserLoginRequestDto } = require("../dto/user.dto");
const { tokenDecoder } = require("../utils/JWT");
const signUp = async (req, res, next) => {
  try {
    const userDtoBody = new UserRegRequestDto(req.body);
    const token = await fromService.signUp(userDtoBody);

    if (!token) {
      throw new Error("Token not generated");
    }

    res.cookie("access-token", token, { maxAge: 30 * 24 * 60 * 60 });
    return res.status(201).send("Signup Success!");
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const userDtoBody = new UserLoginRequestDto(req.body);
    const token = await fromService.logIn(userDtoBody);

    if (!token) {
      throw new Error("Token not generated");
    }

    res.cookie("access-token", token, { maxAge: 30 * 24 * 60 * 60 });
    return res.status(200).send("Login Success!");
  } catch (error) {
    next(error);
  }
};

const myProfile = async (req, res, next) => {
  try {
    const authToken = req.get("authorization");
    const user = await tokenDecoder(authToken.split(" ")[1]);
    const userProfile = await fromService.getProfileService(user);
    if (!userProfile) {
      throw new Error("Unauthorized !");
    }
    return res.status(200).send(userProfile);
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async(req, res, next) =>{
  try {
    const authToken = req.get("authorization");
    const user = await tokenDecoder(authToken.split(" ")[1]);
    const deleteProfile = await fromService.deleteProfileService(user);
    if (!deleteProfile) {
      throw new Error("Can not possible to delete");
    }
    return res.status(200).send("Delete Success!");
  } catch (error) {
    next(error);
  }
}

module.exports = { signUp, logIn, myProfile, deleteProfile };
