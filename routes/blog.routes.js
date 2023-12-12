const express = require("express");
const router = express.Router();
const controller = require("../controllers/blog.controller");
const validateUser = require("../middleware/authentication-authorization");

router.get("/", controller.handleGetAllBlogsRequest);

router.post(
  "/create",
  validateUser.authenticUser,
  controller.handleCreateBlogRequest
);

router.get(
  "/my-blogs",
  validateUser.authenticUser,
  controller.handleGetUserSelfBlogRequest
);

router.get("/:uuid", controller.handleBlogByIdRequest);

router.put(
  "/:uuid",
  validateUser.authenticUser,
  controller.handleUpdateBlogRequest
);

router.delete(
  "/:uuid",
  validateUser.authenticUser,
  controller.handleBlogDeletionRequest
);

module.exports = router;
