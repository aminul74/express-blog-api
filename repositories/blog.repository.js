const Blog = require("../models/blog.model");

const createBlog = async (id, title, content) => {
  return await Blog.create({ authorId: id, title, content });
};

const findBlogsById = async (id) => {
  return await Blog.findAll({
    where: { authorId: id },
    attributes: ["id", "title", "content", "authorId"],
  });
};

const countBlogs = async () => {
  const noOfBlogs = await Blog.count();
  return noOfBlogs;
};

const findAllBlogs = async (page, size) => {
  const result = await Blog.findAndCountAll({
    limit: size,
    offset: page * size,
    order: [["createdAt", "DESC"]],
  });

  return {
    blogs: result.rows,
    totalBlogs: result.count,
  };
};

// const findAllBlogs = async (page, size) => {
//   return await Blog.findAll({
//     attributes: ["id", "title", "content", "authorId"],
//     limit: size,
//     offset: page * size,
//   });
// };

const findBlogById = async (id) => {
  return await Blog.findByPk(id);
};

const deleteBlogById = async (id, blogUUID) => {
  return await Blog.destroy({ where: { id: blogUUID, authorId: id } });
};

const findBlogByUUId = async (blogUUID) => {
  return await Blog.findOne({
    where: { id: blogUUID },
    attributes: ["id", "title", "content", "authorId"],
  });
};

const findBlogByAuthUser = async (id, blogUUID) => {
  return await Blog.findOne({
    where: { id: blogUUID, authorId: id },
    attributes: ["id", "title", "content", "authorId"],
  });
};

const updateBlogById = async (isValidBlog, title, content) => {
  return await isValidBlog.update({ title, content });
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
