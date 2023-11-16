const { sign, verify } = require("jsonwebtoken");

const createToken = (username) => {
  const accessToken = sign({ tokenParam: username }, "access-token");
  return accessToken;
};

module.exports = createToken;
