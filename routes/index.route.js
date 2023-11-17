const express = require("express");
const router = express.Router();
const authenticRoutes = require("../routes/authentic.route");

router.post("/", (req, res) => {
  res.send("Home Page");
});

router.use("/auth", authenticRoutes);

module.exports = router;
