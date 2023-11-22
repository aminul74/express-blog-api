const Blog = require("../models/blog.model");

const createNewBlogInRepo = async (title, content,authorId) => {
  try {
    const newBlog = await Blog.create({
      title,
      content,
      authorId
    });

    return newBlog;
  } catch (error) {
    throw error;
  }
};

module.exports = {createNewBlogInRepo};
