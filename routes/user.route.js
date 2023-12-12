const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const validate = require("../middleware/user.validation");
const ff = require("../middleware/authentication-authorization")

router.get("/my-profile",ff.authenticateUser, controller.handleProfileGetRequest);
router.delete("/delete", controller.handleProfileDeletionRequest);
router.put(
  "/update-password",
  validate.validateUpdate,
  controller.handlePasswordUpdateRequest
);
module.exports = router;
