const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");

router.get("/",blogController.getAllBlogs)
router.post("/",blogController.createBlog);
router.get("/:id")
router.put("/:id")
router.delete("/:id");

module.exports = router;