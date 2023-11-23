const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentication.controller");
const validate = require("../middleware/user.validation");

router.post("/register", validate.validateSignup, controller.signUp);
router.post("/login", validate.validateLogin, controller.logIn);
router.get("/my-profile", controller.myProfile);
router.delete("/delete", controller.deleteProfile);
router.put("/update", controller.updateProfile);
module.exports = router;
