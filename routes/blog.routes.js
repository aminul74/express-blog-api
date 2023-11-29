const express = require("express");
const router = express.Router();
const controller  = require("../controllers/blog.controller");

router.get("/", controller.handleGetAllBlogsRequest);
router.post("/create", controller.handleCreateBlogRequest);
router.get("/my-blogs", controller.handleGetUserSelfBlogRequest);
router.get("/:uuid", controller.handleBlogByIdRequest);
router.put("/:uuid", controller.handleUpdateBlogRequest);
router.delete("/:uuid", controller.handleBlogDeletionRequest);

module.exports = router;
