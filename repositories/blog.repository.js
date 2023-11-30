// const { where } = require("sequelize");
const Blog = require("../models/blog.model");

const createBlog = async (id, title, content) => {
  return await Blog.create({ authorId: id, title, content });
};

const findBlogsById = async (id) => {
  return await Blog.findAll({
    where: { authorId: id },
    attributes: ["id", "title", "content"],
  });
};

const countBlogs = async () =>{
  const noOfBlogs = await Blog.count();
  return noOfBlogs;
}
const findAllBlogs = async (page, size) => {
  return await Blog.findAll({
    limit: size,
    offset: page * size,
  });
};

const findBlogById = async (id) => {
  return await Blog.findByPk(id);
};

const deleteBlogById = async (id, blogUUID) => {
  return await Blog.destroy({ where: { id: blogUUID, authorId: id } });
};

const findBlogByUUId = async (blogUUID) => {
  return await Blog.findOne({
    where: { id: blogUUID },
    attributes: ["id", "title", "content"],
  });
};

const findBlogByAuthUser = async (id, blogUUID) => {
  return await Blog.findOne({
    where: { id: blogUUID, authorId: id },
    attributes: ["id", "title", "content"],
  });
};

const updateBlogById = async (blogUUID, title, content) => {
  return await Blog.update({ title, content }, { where: { id: blogUUID } });
};

module.exports = {
  createBlog,
  findBlogsById,
  findAllBlogs,
  findBlogById,
  deleteBlogById,
  findBlogByUUId,
  updateBlogById,
  findBlogByAuthUser,
  countBlogs,
};
