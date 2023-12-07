const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const validate = require("../middleware/user.validation");

router.get("/my-profile", controller.handleProfileGetRequest);
router.delete("/delete", controller.handleProfileDeletionRequest);
router.put(
  "/update-password",
  validate.validateUpdate,
  controller.handlePasswordUpdateRequest
);
module.exports = router;
