const { sign, verify } = require("jsonwebtoken");
// require("dotenv").config();

const createToken = (username) => {
  console.log("un", username);
  const accessToken = sign({ tokenParam: username }, "access-token");
  return accessToken;
};

async function tokenDecoder(token) {
  try {
    const decodedToken = verify(token, "access-token");
    console.log(decodedToken.tokenParam);
    return decodedToken;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

module.exports = { createToken, tokenDecoder };
