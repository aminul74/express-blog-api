const express = require("express");
const router = express.Router();
const UserRouter = require("./user.route");
const BlogRouter = require("../routes/blog.routes");
const AuthRouter = require("../routes/auth.routes");

router.get("/", (req, res) => {
  res.send("Home Page");
});

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/blogs", BlogRouter);

module.exports = router;
