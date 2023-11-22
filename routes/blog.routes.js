const express = require("express");
const router = express.Router();
const { createBlog } = require("../controllers/blog.controller");

// router.get("/blogs");
router.post("/blogs", createBlog);
// router.get("/:id");
// router.put("/:id");
// router.delete("/:id");

module.exports = router;
