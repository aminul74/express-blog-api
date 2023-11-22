const express = require("express");
const router = express.Router();
const authenticRoutes = require("../routes/authentic.route");
const blogRoutes = require("../routes/blog.routes");

router.get("/", (req, res) => {
  res.send("Home Page");
});
router.use("/auth", authenticRoutes);
router.use("/blogs", blogRoutes);

module.exports = router;
