const { sign, verify } = require("jsonwebtoken");

const TOKEN_KEY = "access-token";

const createToken = (userId) => {
  const accessToken = sign({ id: userId }, TOKEN_KEY);
  return accessToken;
};

const decodeToken = async (token) => {
  return verify(token, TOKEN_KEY);
};

module.exports = { createToken, decodeToken };
