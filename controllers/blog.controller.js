const blogService = require("../services/blog.service");
const userServices = require("../services/user.service");
const { BlogUpdateRequestDto } = require("../dto/blog.dto");
const { getContentBasedOnNegotiation } = require("../utils/responseType");
const handleCreateBlogRequest = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const blogDto = new BlogUpdateRequestDto(title, content);

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

const handleGetUserSelfBlogRequest = async (req, res, next) => {
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

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = getContentBasedOnNegotiation(isGetUserAllBlogs, negotiate);

    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handleGetAllBlogsRequest = async (req, res, next) => {
  try {
    const isGetAllBlogs = await blogService.processAllBlogs();
    if (!isGetAllBlogs) {
      const error = new Error("Page not found!");
      error.status = 404;
      throw error;
    }
    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = getContentBasedOnNegotiation(isGetAllBlogs, negotiate);

    return res.status(200).send(response);
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
    return res.status(200).send("Delete success!");
  } catch (error) {
    next(error);
  }
};

const handleBlogByIdRequest = async (req, res, next) => {
  try {
    const blogUUID = req.params.uuid;
    const user = await userServices.userFromAuthToken(
      req.cookies["access-token"]
    );

    const isGetBlogById = await blogService.processBlogbyId(user, blogUUID);

    if (!isGetBlogById) {
      const error = new Error("Unable to process! Please try again");
      error.status = 404;
      throw error;
    }
    const getBlogById = [isGetBlogById];

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = getContentBasedOnNegotiation(getBlogById, negotiate);

    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handleUpdateBlogRequest = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blogDto = new BlogUpdateRequestDto(title, content);
    const blogUUID = req.params.uuid;
    const user = await userServices.userFromAuthToken(
      req.cookies["access-token"]
    );
    const isUpdateBlog = await blogService.processUpdateBlog(
      user,
      blogUUID,
      blogDto
    );

    if (!isUpdateBlog) {
      const error = new Error("Unable to update! please try again");
      error.status = 404;
      throw error;
    }
    return res.status(200).send("Update success!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateBlogRequest,
  handleGetUserSelfBlogRequest,
  handleGetAllBlogsRequest,
  handleBlogDeletionRequest,
  handleBlogByIdRequest,
  handleUpdateBlogRequest,
};
