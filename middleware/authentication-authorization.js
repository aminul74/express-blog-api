const jwt = require("../utils/JWT");
const authenticateUser = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  req.user = authorizationHeader; // Attach user information to the request
  next();
};

function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    // User is authorized
    next();
  } else {
    // User is not authorized
    res.status(403).send("Forbidden");
  }
}

// if (!authorizationHeader) {
//     return res.status(401).send("Unauthorized");
//   }

//   const accessToken = authorizationHeader.split(" ")[1];
//   console.log("ZZZZ", accessToken);
//   if (!accessToken) {
//     return res.status(401).send("Unauthorized");
//   }
//   try {
//     const decoded = jwt.decodeToken(accessToken);

//     req.user = decoded;
//     console.log("YYYY", req.user);
//     next();
//   } catch (error) {
//     return res.status(401).send("Unauthorized");
//   }

// const authorizeUser = (requiredRole) => (req, res, next) => {
//   const user = req.user;

//   // Check if the user has the required role
//   if (requiredRole && user.role !== requiredRole) {
//     return res.status(403).send("Forbidden: Insufficient permissions");
//   }

//   next();
// };

module.exports = { authenticateUser };
