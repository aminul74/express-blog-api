const Blog = require("../models/blog.model");
const {createNewBlogInRepo} = require("../repositories/blog.repository");
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

const createNewBlogInService = async (title, content,authorId) => {
  try {
    const newBlog = await createNewBlogInRepo(title, content,authorId);
    if (!newBlog) {
      throw new Error("Failed to create a new blog post");
    }
    return newBlog;
  } catch (error) {
    throw error;
  }
};

module.exports = {createNewBlogInService };
