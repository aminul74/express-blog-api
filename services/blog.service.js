const blogRepositories = require("../repositories/blog.repository");

const processNewBlog = async (user, blogDto) => {
  const proccessBlog = await blogRepositories.createBlog(
    user.id,
    blogDto.title,
    blogDto.content
  );

  if (!proccessBlog) {
    throw new Error("Unable to process! Please try again");
  }
  return proccessBlog;
};

const processSpecificUserBlog = async (page, size, user) => {
  page = !Number.isNaN(page) && page > 0 ? page - 1 : 0;
  size = !Number.isNaN(size) && size > 0 && size < 5 ? size : 6;

  const result = await blogRepositories.findBlogsById(page, size, user.id);
  const numOfBlogs = result.count;
  const pageLimit = Math.ceil(numOfBlogs / size);
  page = (page >= pageLimit) ? 0 : page;

  if (!numOfBlogs) {
    throw new Error("No blogs found.");
  }
  return result;
};

const processAllBlogs = async (page, size) => {
  page = !Number.isNaN(page) && page > 0 ? page - 1 : 0;
  size = !Number.isNaN(size) && size > 0 && size < 5 ? size : 6;
  const result = await blogRepositories.findAllBlogs(page, size);

  const numOfBlogs = result.totalBlogs;
  const pageLimit = Math.ceil(numOfBlogs / size);
  page = page >= pageLimit ? 0 : page;

  if (!numOfBlogs) {
    throw new Error("No blogs found.");
  }

  return result;
};

const processDeleteBlog = async (user, blogUUID) => {
  const deletedBlog = await blogRepositories.deleteBlogById(user.id, blogUUID);
  if (!deletedBlog) {
    const error = new Error("Blog not found!");
    error.status = 404;
    throw error;
  }
  return deletedBlog;
};

const processBlogbyId = async (blogUUID) => {
  const getBlog = await blogRepositories.findBlogByUUId(blogUUID);

  if (!getBlog) {
    const error = new Error("Blog not found!");
    error.status = 404;
    throw error;
  }

  return getBlog;
};

const processUpdateBlog = async (user, blogUUID, blogDto) => {
  const { title, content } = blogDto;
  const isValidBlog = await blogRepositories.findBlogByAuthUser(
    user.id,
    blogUUID
  );

  if (!isValidBlog) {
    const error = new Error("Unauthorized to Update");
    error.status = 404;
    throw error;
  }
  const processToUpdateBlog = await blogRepositories.updateBlogById(
    isValidBlog,
    title,
    content
  );

  if (!processToUpdateBlog) {
    const error = new Error("Please try again");
    error.status = 404;
    throw error;
  }

  return processToUpdateBlog;
};

module.exports = {
  processNewBlog,
  processSpecificUserBlog,
  processAllBlogs,
  processDeleteBlog,
  processBlogbyId,
  processUpdateBlog,
};
