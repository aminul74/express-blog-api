const blogService = require("../services/blog.service");
const userServices = require("../services/user.service");
const { UserBlogRequestDto } = require("../dto/blog.dto");

const handleCreateBlogRequest = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const blogDto = new UserBlogRequestDto(title, content);

    const user = await userServices.userFromAuthToken(
      req.cookies["access-token"]
    );

    const isBlogCreated = await blogService.processNewBlog(user, blogDto);

    if (!isBlogCreated) {
      const error = new Error("Blog create fail");
      error.status = 400;
      throw error;
    }
    return res.status(201).send("Blog create Success !");
  } catch (error) {
    next(error);
  }
};

const handleGetUserAllBlogRequest = async (req, res, next) => {
  try {
    const user = await userServices.userFromAuthToken(
      req.cookies["access-token"]
    );

    const isGetUserAllBlogs = await blogService.processSpecificUserBlog(user);
    if (!isGetUserAllBlogs) {
      const error = new Error("Unable to process please try again");
      error.status = 404;
      throw error;
    }
    return res.status(200).send(isGetUserAllBlogs);
  } catch (error) {
    next(error);
  }
};

const handleGetAllBlogRequest = async (req, res, next) => {
  try {
    const isGetAllBlogs = await blogService.processAllBlogs();
    if (!isGetAllBlogs) {
      const error = new Error("Page not found!");
      error.status = 404;
      throw error;
    }
    return res.status(200).send(isGetAllBlogs);
  } catch (error) {
    next(error);
  }
};

const handleBlogDeletionRequest = async (req, res, next) => {
  try {
    const blogUUID = req.params.uuid;

    const user = await userServices.userFromAuthToken(
      req.cookies["access-token"]
    );
    const isDeletedBlog = await blogService.processDeleteBlog(user, blogUUID);

    if (!isDeletedBlog) {
      const error = new Error("Unable to delete");
      error.status = 404;
      throw error;
    }
    return res.status(204).send("Delete success!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateBlogRequest,
  handleGetUserAllBlogRequest,
  handleGetAllBlogRequest,
  handleBlogDeletionRequest,
};
