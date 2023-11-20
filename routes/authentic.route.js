const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentication.controller");
const validate = require("../middleware/user.validation")


router.post("/register",validate.validateSignup, controller.signUp);
router.post("/login",validate.validateLogin, controller.logIn);

module.exports = router;
