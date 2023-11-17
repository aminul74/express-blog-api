const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const authenticRepo = require("../repositories/authentic.repo");
const userDto = require("../dto/user.dto");
const jwtToken = require("../utils/JWT");

const signUp = async (body) => {
  try {
    const { username, email, password } = userDto(body)
    const singleUser = await authenticRepo.signUpRepo(email);

    if (singleUser) return null;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwtToken(newUser);
    return token;
  } catch (error) {
    return error;
  }
};

const logIn = async (username, password) => {
  try {
    const user = await authenticRepo.logInRepo(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return null;

    const token = jwtToken(username);
    return token;
  } catch (error) {
    return error;
  }
};

module.exports = { signUp, logIn };
