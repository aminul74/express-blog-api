// const {createNewBlogInService} = require("../services/blog.service");
// const { UserBlogRequestDto } = require("../dto/blog.dto");

const { UserBlogRequestDto } = require("../dto/blog.dto");
const { blogService } = require("../services/blog.service");
const { tokenDecoder } = require("../utils/JWT");

const createBlog = async (req, res, next) => {
  try {
    const authToken = req.get("authorization");
    const user = await tokenDecoder(authToken.split(" ")[1]);

    const blogDto = new UserBlogRequestDto(req.body, user);
    const newBlog = await blogService(blogDto);
    console.log("get usernamexxxxxxxxxx", blogDto.username);
    return res.status(201).send(newBlog);
  } catch (error) {
    return next(error);
  }
};
// const getAllBlogs = async (req, res, next) => {
//   try {

//     const allBlogs = await findAllBlog();
//     return res.status(200).send(allBlogs);
//   } catch (error) {

//   }
// };

module.exports = { createBlog };
