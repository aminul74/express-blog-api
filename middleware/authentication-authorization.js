const jwt = require("../utils/JWT");
const userService = require("../services/user.service");
const {} = require("../utils//responseType");
const authenticUser = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).send("Unauthorized");
    }

    const data = await jwt.decodeToken(accessToken);
    const user = await userService.userByTokenId(data);
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { authenticUser };
