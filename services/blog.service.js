const Blog = require("../models/blog.model");

const findAllBlog = (query) => {
  try {
    const allBlog = Blog.findAll({
      where: {
        title: query.title,
        content: query.content,
      },
    });
    return allBlog;
  } catch (error) {
    throw error;
  }
};

const createNewBlog = async (id, title, content, authorId) => {
  try {
    const newBlog = Blog.create({
      id,
      title,
      content,
      authorId,
    });

    return newBlog;
  } catch (error) {
    throw error;
  }
};

module.exports = { findAllBlog, createNewBlog };
