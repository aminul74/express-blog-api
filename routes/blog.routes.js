const express = require("express");
const blogRouter = express.Router();
const { createBlog } = require("../controllers/blog.controller");

// blogRouter.get("/blogs");
blogRouter.post("/", createBlog);
// blogRouter.get("/:id");
// blogRouter.put("/:id");
// blogRouter.delete("/:id");

module.exports = blogRouter;
