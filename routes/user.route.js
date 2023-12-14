const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const validate = require("../middleware/user.validation");
const userValidate = require("../middleware/authentication-authorization");

router.get(
  "/my-profile",
  userValidate.authenticUser,
  controller.handleProfileGetRequest
);
router.delete(
  "/:uuid",
  userValidate.authenticUser,
  controller.handleProfileDeletionRequest
);
router.put(
  "/:uuid",
  userValidate.authenticUser,
  validate.validateUpdate,
  controller.handlePasswordUpdateRequest
);
module.exports = router;
