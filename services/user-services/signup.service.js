const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const signUpRepo = require("../../repositories/signup.repo"); 
const jwtToken = require("../../utils/JWT");

const signUp = async (username,email,password) => {
  try {
    const singleUser = await signUpRepo(email);
    
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

}

module.exports = signUp;
