const Blog = require("../models/blog.model");

const createNewBlogInRepo = async (blogDto) => {
  try {
    const {title,content,author} = blogDto
    console.log("before:")
    const newBlog = await Blog.create({
      title,
      content,
      author
    });

    console.log("after")
    return newBlog;
  } catch (error) {
    throw error;
  }
};

module.exports = {createNewBlogInRepo};
