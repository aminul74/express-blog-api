const express = require("express");
const blogRouter = express.Router();
const { createBlog } = require("../controllers/blog.controller");

// router.get("/blogs");
blogRouter.post("/", createBlog);
// router.get("/:id");
// router.put("/:id");
// router.delete("/:id");

module.exports = blogRouter;
