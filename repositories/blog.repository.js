const Blog = require("../models/blog.model");
const User = require("../models/user.model");

const createBlog = async (id, title, content) => {
  return await Blog.create({ authorId: id, title, content });
};

const findBlogsById = async (page, size, id) => {
  const blogs = await Blog.findAndCountAll({
    limit: size,
    offset: page * size,
    where: { authorId: id },
    order: [["createdAt", "DESC"]],
  });
  return { blogs: blogs.rows, count: blogs.count };
};

// const countBlogs = async () => {
//   const noOfBlogs = await Blog.count();
//   return noOfBlogs;
// };

const findAllBlogs = async (page, size) => {
  const result = await Blog.findAndCountAll({
    limit: size,
    offset: page * size,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  });

  return {
    blogs: result.rows,
    totalBlogs: result.count,
  };
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
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
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
  // countBlogs,
};
