const blogService = require("../services/blog.service");
const BlogDto = require("../dto/blog.dto");
const { getContentBasedOnNegotiation } = require("../utils/responseType");

const handleCreateBlogRequest = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const blogDto = new BlogDto.BlogCreateRequestDto(title, content);

    const userData = req.user;

    const isBlogCreated = await blogService.processNewBlog(userData, blogDto);

    const newBlog = [isBlogCreated];
    const jsonBlogs = newBlog.map((blog) => blog.get({ plain: true }));

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(jsonBlogs, negotiate);

    return res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

const handleGetUserSelfBlogRequest = async (req, res, next) => {
  try {
    const userData = req.user;

    const isGetUserAllBlogs = await blogService.processSpecificUserBlog(
      userData
    );

    const jsonBlogs = isGetUserAllBlogs.map((blog) =>
      blog.get({ plain: true })
    );
    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(jsonBlogs, negotiate);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const handleGetAllBlogsRequest = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page);
    const size = Number.parseInt(req.query.size);

    const isGetAllBlogs = await blogService.processAllBlogs(page, size);
    const jsonBlogs = isGetAllBlogs.map((blogs) => blogs.get({ plain: true }));

    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(jsonBlogs, negotiate);
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

    const userData = req.user;
    const isDeletedBlog = await blogService.processDeleteBlog(
      userData,
      blogUUID
    );

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
    const jsonBlogs = getBlogById.map((blog) => blog.get({ plain: true }));
    const negotiate = req.accepts(["json", "text", "xml", "html"]);

    if (!negotiate) {
      return res.status(406).send("Not Acceptable");
    }

    res.type(negotiate);
    const response = await getContentBasedOnNegotiation(jsonBlogs, negotiate);

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

    const userData = req.user;
    const isUpdateBlog = await blogService.processUpdateBlog(
      userData,
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
