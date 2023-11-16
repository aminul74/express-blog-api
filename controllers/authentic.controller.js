const signupFromService = require("../services/user-services/signup.service");
const loginFromService = require("../services/user-services/login.service");

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const token = await signupFromService(username, email, password );
    if(!token) return res.send("user already exists");

    res.cookie("access-token", token, { maxAge: 30 * 24 * 60 * 60 });
    return res.status(201).send("Signup Success!");
  } catch (error) {
    return res.status(400).send("Internal Server Error.");
  }
};

const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const token = await loginFromService(username, password );

    if(!token) return res.send("Username or Password incorrect");

    res.cookie("access-token", token, { maxAge: 30 * 24 * 60 * 60 });
    return res.status(200).send("Login Success!");
  } catch (error) {
    return res.status(400).send("Internal server error.");
  }
};


module.exports = { signUp,logIn };
