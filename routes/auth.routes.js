const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const validate = require("../middleware/user.validation");

router.post(
  "/register",
  validate.validateSignup,
  controller.handleUserRegistration
);
router.post("/login", validate.validateLogin, controller.handleLoginRequest);

module.exports = router;
