const { sign, verify } = require("jsonwebtoken");
// require("dotenv").config();

const TOKEN_KEY = "access-token";

const createToken = (userId) => {
  console.log("userId", userId);
  const accessToken = sign({ id: userId }, TOKEN_KEY);
  return accessToken;
};

const decodeToken = async (token) => {
  try {
    console.log("token", token);
    return verify(token, TOKEN_KEY); // { id: userId }
  } catch (error) {
    throw error;
  }
};

module.exports = { createToken, decodeToken };
