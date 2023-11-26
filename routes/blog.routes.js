const express = require("express");
const router = express.Router();
const controller  = require("../controllers/blog.controller");

router.get("/", controller.handleGetAllBlogRequest);
router.post("/create", controller.handleCreateBlogRequest);
router.get("/my-blogs", controller.handleGetUserAllBlogRequest);
// router.put("/:id");
router.delete("/:uuid", controller.handleBlogDeletionRequest);

module.exports = router;
