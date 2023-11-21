const blogService = require("../services/blog.service");
// const { UserBlogRequestDto } = require("../dto/blog.dto");

const getAllBlogs = async (req, res, next) => {
  try {
    const allBlogs = await blogService.findAllBlog(req.query);
    return res.status(200).send(allBlogs);
  } catch (error) {

  }
};

const createBlog = async (req, res, next) => {
  try {
    const { id, title, content, authorId } = req.body;
    const newBlog = await blogService.createBlogService(title, content);
    return res.status(200).send(newBlog);
  } catch (error) {
    throw error
  }
};

module.exports = { getAllBlogs,createBlog };
