const fromService = require("../services/authentication.service");
const { UserRegRequestDto, UserLoginRequestDto } = require("../dto/user.dto");

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

module.exports = { signUp, logIn };