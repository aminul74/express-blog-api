const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentic.controller");
// const validation = require("../middleware/validate.middleware");
// const schema = require("../middleware/user.validation");
const validate = require("../middleware/user.validation")


router.post("/register",validate.validateSignup, controller.signUp);
router.post("/login",validate.validateLogin, controller.logIn);

module.exports = router;
