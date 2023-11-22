const {createNewBlogInService} = require("../services/blog.service");
// const { UserBlogRequestDto } = require("../dto/blog.dto");

// const getAllBlogs = async (req, res, next) => {
//   try {

//     const allBlogs = await findAllBlog();
//     return res.status(200).send(allBlogs);
//   } catch (error) {

//   }
// };

const createBlog = async (req, res, next) => {
  try {
    const {title, content, authorId} = req.body;
    const newBlog = await createNewBlogInService(title, content, authorId);
    return res.status(200).send(newBlog);
  } catch (error) {
    throw error
  }
};

module.exports = {createBlog };
