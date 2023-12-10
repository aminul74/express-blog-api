const blogService = require("../services/blog.service");
const userService = require("../services/user.service");
const BlogDto = require("../dto/blog.dto");
const { getContentBasedOnNegotiation } = require("../utils/responseType");

const handleCreateBlogRequest = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const blogDto = new BlogDto.BlogCreateRequestDto(title, content);
    // const user = await userService.userFromAuthToken(
    //   req.cookies["access-token"]
    // );
    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];

    const user = await userService.userFromAuthToken(accessToken);
    const isBlogCreated = await blogService.processNewBlog(user, blogDto);

    const newBlog = [isBlogCreated];
    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = getContentBasedOnNegotiation(newBlog, negotiate);

    return res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

const handleGetUserSelfBlogRequest = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];

    const user = await userService.userFromAuthToken(accessToken);

    const isGetUserAllBlogs = await blogService.processSpecificUserBlog(user);

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
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 5;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 5) {
      size = sizeAsNumber;
    }

    const isGetAllBlogs = await blogService.processAllBlogs(page, size);

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = getContentBasedOnNegotiation(isGetAllBlogs, negotiate);
    if (!response) {
      const error = new Error("No response");
      error.status = 400;
      throw error;
    }
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handleBlogDeletionRequest = async (req, res, next) => {
  try {
    const blogUUID = req.params.uuid;

    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];

    const user = await userService.userFromAuthToken(accessToken);
    
    const isDeletedBlog = await blogService.processDeleteBlog(user, blogUUID);

    return res.status(200).send("Delete success!");
  } catch (error) {
    next(error);
  }
};

const handleBlogByIdRequest = async (req, res, next) => {
  try {
    const blogUUID = req.params.uuid;

    const isGetBlogById = await blogService.processBlogbyId(blogUUID);

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
    const blogDto = new BlogDto.BlogUpdateRequestDto(title, content);
    const blogUUID = req.params.uuid;
    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];

    const user = await userService.userFromAuthToken(accessToken);

    const isUpdateBlog = await blogService.processUpdateBlog(
      user,
      blogUUID,
      blogDto
    );

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
