// const Blog = require("../models/blog.model");
// const {createNewBlogInRepo} = require("../repositories/blog.repository");
// const findAllBlog = (query) => {
//   try {
//     const allBlog = Blog.findAll({
//       where: {
//         title: query.title,
//         content: query.content,
//       },
//     });
//     return allBlog;
//   } catch (error) {
//     throw error;
//   }
// };

const {createNewBlogInRepo} = require("../repositories/blog.repository");

const blogService = async (blogDto) => {
  try {
    const newBlog = await createNewBlogInRepo(blogDto);
    if (!newBlog) {
      throw new Error("Failed to create a new blog post");
    }
    return newBlog;
  } catch (error) {
    throw error;
  }
};

module.exports = {blogService };


