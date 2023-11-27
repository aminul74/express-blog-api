const express = require("express");
const router = express.Router();
const controller  = require("../controllers/blog.controller");

router.get("/", controller.handleGetAllBlogRequest);
router.post("/create", controller.handleCreateBlogRequest);
router.get("/my-blogs", controller.handleGetUserAllBlogRequest);
router.get("/:uuid", controller.handleBlogByIdRequest);
router.put("/:uuid", controller.handleUpdateBlogRequest);
router.delete("/:uuid", controller.handleBlogDeletionRequest);

module.exports = router;
