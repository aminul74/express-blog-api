const Blog = require("../models/blog.model");

const createBlog = async (id, title, content) => {
  return await Blog.create({ authorId: id, title, content });
};

const findBlogById = async (id) => {
  return await Blog.findAll({ where: { authorId: id } });
};

const findAllBlogs = async () => {
  return await Blog.findAll();
};

module.exports = { createBlog, findBlogById, findAllBlogs };
