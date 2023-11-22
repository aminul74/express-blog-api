const { sign, verify } = require("jsonwebtoken");
// require("dotenv").config();

const createToken = (username) => {
  const accessToken = sign({ tokenParam: username }, "access-token");
  return accessToken;
};

module.exports = { createToken };
