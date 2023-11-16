const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentic.controller");
const validation = require("../middleware/validate.middleware");
const signupSchema = require("../validation/signup.validation");
const loginSchema = require("../validation/login.validation")


router.post("/register",validation(signupSchema), controller.signUp);
router.post("/login",validation(loginSchema), controller.logIn);

module.exports = router;
