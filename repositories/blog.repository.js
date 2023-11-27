const { where } = require("sequelize");
const Blog = require("../models/blog.model");

const createBlog = async (id, title, content) => {
  return await Blog.create({ authorId: id, title, content });
};

const findBlogsById = async (id) => {
  return await Blog.findAll({ where: { authorId: id } });
};

const findAllBlogs = async () => {
  return await Blog.findAll();
};

const findBlogById = async (id) => {
  return await Blog.findByPk(id);
};

const deleteBlogById = async (id, blogUUID) => {
  return await Blog.destroy({ where: { id: blogUUID, authorId: id } });
};

const findBlogByUserId = async (id, blogUUID) => {
  return await Blog.findOne({ id: blogUUID }, { where: { authorId: id } });
};

const findAuthorBlogById = async (id, blogUUID) => {
  return await Blog.findOne({ where: { id: blogUUID, authorId: id } });
};

const updateBlogById = async (blogUUID, title, content) => {
  return await Blog.update({ title, content }, { where: { id: blogUUID} });
};

module.exports = {
  createBlog,
  findBlogsById,
  findAllBlogs,
  findBlogById,
  deleteBlogById,
  findBlogByUserId,
  updateBlogById,
  findAuthorBlogById,
};
